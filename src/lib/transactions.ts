import { database } from './database';

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  notes?: string;
}

export const transactionStore = {
  async getAll(): Promise<Transaction[]> {
    try {
      return await database.getAllTransactions();
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  },

  async create(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    try {
      return await database.createTransaction(transaction);
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  },

  async update(id: number, transaction: Omit<Transaction, "id">): Promise<Transaction> {
    try {
      return await database.updateTransaction(id, transaction);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await database.deleteTransaction(id);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  }
};
