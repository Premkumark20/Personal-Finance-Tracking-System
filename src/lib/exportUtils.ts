import * as XLSX from 'xlsx';
import { transactionStore, type Transaction } from './transactions';
import { database } from './database';

export const exportTransactionsToExcel = async (transactions: Transaction[], filename?: string) => {
  const exportData = transactions.map(t => ({
    Date: t.date,
    Title: t.title,
    Category: t.category,
    Type: t.type,
    Amount: t.amount,
    'Amount (₹)': t.type === 'income' ? `+₹${t.amount.toFixed(2)}` : `-₹${t.amount.toFixed(2)}`
  }));
  
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, filename || `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportBudgetsToExcel = async (filename?: string) => {
  try {
    const budgets = await database.getAllBudgets();
    const transactions = await transactionStore.getAll();
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const spending: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .forEach((t) => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });

    const budgetData = budgets.map(b => ({
      Category: b.category,
      'Budget Limit': b.limit,
      'Spent': spending[b.category] || 0,
      'Remaining': Math.max(0, b.limit - (spending[b.category] || 0)),
      'Usage %': Math.min(((spending[b.category] || 0) / b.limit) * 100, 100).toFixed(1)
    }));

    const ws = XLSX.utils.json_to_sheet(budgetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Budgets");
    XLSX.writeFile(wb, filename || `budgets_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (error) {
    console.error('Failed to export budgets:', error);
    throw error;
  }
};

export const exportSummaryToExcel = async (filename?: string) => {
  try {
    const transactions = await transactionStore.getAll();
    
    // Monthly summary data
    const monthlyData: Record<string, { income: number; expense: number; balance: number }> = {};
    
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0, balance: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
      monthlyData[month].balance = monthlyData[month].income - monthlyData[month].expense;
    });

    const summaryData = Object.entries(monthlyData).map(([month, data]) => ({
      Month: month,
      Income: data.income,
      Expenses: data.expense,
      Balance: data.balance,
      'Savings Rate': data.income > 0 ? ((data.balance / data.income) * 100).toFixed(1) : '0'
    }));

    const ws = XLSX.utils.json_to_sheet(summaryData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary");
    XLSX.writeFile(wb, filename || `summary_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (error) {
    console.error('Failed to export summary:', error);
    throw error;
  }
};

export const exportAllToExcel = async (filename?: string) => {
  try {
    const transactions = await transactionStore.getAll();
    const budgets = await database.getAllBudgets();
    
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    // Dashboard sheet - Summary overview
    const monthlyData: Record<string, { income: number; expense: number; balance: number }> = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0, balance: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
      monthlyData[month].balance = monthlyData[month].income - monthlyData[month].expense;
    });

    const dashboardData = Object.entries(monthlyData).map(([month, data]) => ({
      Month: month,
      Income: data.income,
      Expenses: data.expense,
      Balance: data.balance,
      'Savings Rate': data.income > 0 ? ((data.balance / data.income) * 100).toFixed(1) : '0'
    }));
    const dashboardWs = XLSX.utils.json_to_sheet(dashboardData);
    XLSX.utils.book_append_sheet(wb, dashboardWs, "Dashboard");
    
    // Transactions sheet
    const transactionData = transactions.map(t => ({
      Date: t.date,
      Title: t.title,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      'Amount (₹)': t.type === 'income' ? `+₹${t.amount.toFixed(2)}` : `-₹${t.amount.toFixed(2)}`
    }));
    const transactionWs = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(wb, transactionWs, "Transactions");
    
    // Summary sheet
    const summaryData = Object.entries(monthlyData).map(([month, data]) => ({
      Month: month,
      Income: data.income,
      Expenses: data.expense,
      Balance: data.balance,
      'Savings Rate': data.income > 0 ? ((data.balance / data.income) * 100).toFixed(1) : '0'
    }));
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
    
    // Budgets sheet
    const currentMonth = new Date().toISOString().slice(0, 7);
    const spending: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .forEach((t) => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });

    const budgetData = budgets.map(b => ({
      Category: b.category,
      'Budget Limit': b.limit,
      'Spent': spending[b.category] || 0,
      'Remaining': Math.max(0, b.limit - (spending[b.category] || 0)),
      'Usage %': Math.min(((spending[b.category] || 0) / b.limit) * 100, 100).toFixed(1)
    }));
    const budgetWs = XLSX.utils.json_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(wb, budgetWs, "Budgets");
    
    // Calendar sheet
    const calendarData: Record<string, any> = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = date.toISOString().slice(0, 7);
      if (!calendarData[monthKey]) {
        calendarData[monthKey] = { income: 0, expense: 0, transactions: 0 };
      }
      if (t.type === 'income') {
        calendarData[monthKey].income += t.amount;
      } else {
        calendarData[monthKey].expense += t.amount;
      }
      calendarData[monthKey].transactions += 1;
    });
    
    const calendarSheetData = Object.entries(calendarData).map(([month, data]) => ({
      Month: month,
      Income: data.income,
      Expenses: data.expense,
      'Transaction Count': data.transactions,
      'Average Transaction': data.transactions > 0 ? (data.income + data.expense) / data.transactions : 0
    }));
    const calendarWs = XLSX.utils.json_to_sheet(calendarSheetData);
    XLSX.utils.book_append_sheet(wb, calendarWs, "Calendar");
    
    XLSX.writeFile(wb, filename || `finance_complete_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (error) {
    console.error('Failed to export all data:', error);
    throw error;
  }
};
