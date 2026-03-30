import { Transaction } from './transactions';

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'FinanceDashboard';
  private readonly version = 1;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create transactions object store
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
          transactionStore.createIndex('date', 'date', { unique: false });
          transactionStore.createIndex('type', 'type', { unique: false });
          transactionStore.createIndex('category', 'category', { unique: false });
        }
        
        // Create budgets object store
        if (!db.objectStoreNames.contains('budgets')) {
          const budgetStore = db.createObjectStore('budgets', { keyPath: 'category' });
          budgetStore.createIndex('limit', 'limit', { unique: false });
        }
      };
    });
  }

  private async getObjectStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // Export database to JSON (can be converted to .db)
  async exportDatabase(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const transactions = await this.getAllTransactions();
      const budgets = await this.getAllBudgets();
      
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          transactions,
          budgets
        }
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finance-dashboard.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export database:', error);
      throw error;
    }
  }

  // Import database from JSON file
  async importDatabase(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const jsonString = event.target?.result as string;
          const importData = JSON.parse(jsonString);
          
          // Validate import data structure
          if (!importData.data || !importData.data.transactions || !importData.data.budgets) {
            throw new Error('Invalid database file format');
          }

          // Clear existing data
          await this.clearAllData();
          
          // Import transactions
          for (const transaction of importData.data.transactions) {
            await this.createTransaction(transaction);
          }
          
          // Import budgets
          for (const budget of importData.data.budgets) {
            await this.createBudget(budget.category, budget.limit);
          }
          
          resolve();
        } catch (error) {
          console.error('Failed to import database:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private async clearAllData(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    // Clear transactions
    const transactionStore = await this.getObjectStore('transactions', 'readwrite');
    const clearTransactions = transactionStore.clear();
    
    // Clear budgets
    const budgetStore = await this.getObjectStore('budgets', 'readwrite');
    const clearBudgets = budgetStore.clear();

    await Promise.all([clearTransactions, clearBudgets]);
  }

  // Transaction CRUD operations
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const store = await this.getObjectStore('transactions', 'readonly');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const transactions = request.result.sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          resolve(transactions);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const dbTransaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = dbTransaction.objectStore('transactions');
      const request = store.add(transaction);

      request.onsuccess = () => {
        const newTransaction = { ...transaction, id: request.result as number };
        resolve(newTransaction);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateTransaction(id: number, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const dbTransaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = dbTransaction.objectStore('transactions');
      const request = store.put({ ...transaction, id });

      request.onsuccess = () => {
        const updatedTransaction = { ...transaction, id };
        resolve(updatedTransaction);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const dbTransaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = dbTransaction.objectStore('transactions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    try {
      const store = await this.getObjectStore('transactions', 'readonly');
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get transaction:', error);
      return null;
    }
  }

  // Budget CRUD operations
  async getAllBudgets(): Promise<Array<{ category: string; limit: number }>> {
    try {
      const store = await this.getObjectStore('budgets', 'readonly');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get budgets:', error);
      return [];
    }
  }

  async createBudget(category: string, limit: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const dbTransaction = this.db!.transaction(['budgets'], 'readwrite');
      const store = dbTransaction.objectStore('budgets');
      const request = store.put({ category, limit });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteBudget(category: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const dbTransaction = this.db!.transaction(['budgets'], 'readwrite');
      const store = dbTransaction.objectStore('budgets');
      const request = store.delete(category);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Statistics queries
  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    try {
      const store = await this.getObjectStore('transactions', 'readonly');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const filtered = request.result.filter((t: any) => 
            t.date >= startDate && t.date <= endDate
          ).sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          resolve(filtered);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get transactions by date range:', error);
      return [];
    }
  }

  async getTotalByType(type: 'income' | 'expense'): Promise<number> {
    try {
      const store = await this.getObjectStore('transactions', 'readonly');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const total = request.result
            .filter((t: any) => t.type === type)
            .reduce((sum: number, t: any) => sum + t.amount, 0);
          resolve(total);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get total by type:', error);
      return 0;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}

// Export singleton instance
export const database = new DatabaseService();
