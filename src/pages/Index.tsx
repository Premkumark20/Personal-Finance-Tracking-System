import { useState, useCallback, useEffect } from "react";
import { transactionStore, type Transaction } from "@/lib/transactions";
import SummaryCard from "@/components/SummaryCard";
import TransactionModal from "@/components/TransactionModal";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import RecentTransactions from "@/components/RecentTransactions";
import { TrendingDown, TrendingUp } from "lucide-react";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [defaultType, setDefaultType] = useState<"income" | "expense">("expense");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await transactionStore.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const fmt = (n: number) => `₹${n.toFixed(2)}`;

  const handleSave = async (data: Omit<Transaction, "id">) => {
    try {
      if (editing) {
        await transactionStore.update(editing.id, data);
      } else {
        await transactionStore.create(data);
      }
      setModalOpen(false);
      setEditing(null);
      await refresh();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const openAddExpense = () => {
    setEditing(null);
    setDefaultType("expense");
    setModalOpen(true);
  };

  const openAddIncome = () => {
    setEditing(null);
    setDefaultType("income");
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-base sm:text-lg font-semibold">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={openAddExpense}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-destructive text-destructive-foreground transition-fast hover:brightness-110 w-full sm:w-auto"
          >
            <TrendingDown className="h-4 w-4" />
            Add Expense
          </button>
          <button
            onClick={openAddIncome}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-income text-primary-foreground transition-fast hover:brightness-110 w-full sm:w-auto"
          >
            <TrendingUp className="h-4 w-4" />
            Add Income
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 mb-4">
        <SummaryCard label="Total Balance" value={fmt(balance)} />
        <SummaryCard label="Total Income" value={fmt(income)} variant="income" />
        <SummaryCard label="Total Expenses" value={fmt(expense)} variant="expense" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-4">
        <IncomeExpenseChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </div>

      <RecentTransactions transactions={transactions} limit={5} />

      <TransactionModal
        open={modalOpen}
        transaction={editing}
        defaultType={defaultType}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Index;
