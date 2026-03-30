import { useState, useCallback, useEffect, useMemo } from "react";
import { transactionStore, type Transaction } from "@/lib/transactions";
import TransactionTable from "@/components/TransactionTable";
import TransactionModal from "@/components/TransactionModal";
import { TrendingDown, TrendingUp } from "lucide-react";

type Period = "all" | "daily" | "monthly" | "yearly";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [defaultType, setDefaultType] = useState<"income" | "expense">("expense");
  const [period, setPeriod] = useState<Period>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");

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

  const filtered = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);
    const yearStr = now.toISOString().slice(0, 4);

    let list = transactions;
    if (period === "daily") list = list.filter((t) => t.date === todayStr);
    else if (period === "monthly") list = list.filter((t) => t.date.startsWith(monthStr));
    else if (period === "yearly") list = list.filter((t) => t.date.startsWith(yearStr));

    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter);
    return list;
  }, [transactions, period, typeFilter]);

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

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await transactionStore.remove(id);
        await refresh();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const selectClass =
    "px-3 py-1.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-lg sm:text-xl font-semibold">Transactions</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => { setEditing(null); setDefaultType("expense"); setModalOpen(true); }}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-destructive text-destructive-foreground transition-fast hover:brightness-110 w-full sm:w-auto"
          >
            <TrendingDown className="h-4 w-4" />
            Add Expense
          </button>
          <button
            onClick={() => { setEditing(null); setDefaultType("income"); setModalOpen(true); }}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-income text-primary-foreground transition-fast hover:brightness-110 w-full sm:w-auto"
          >
            <TrendingUp className="h-4 w-4" />
            Add Income
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={selectClass}>
            <option value="all">All Time</option>
            <option value="daily">Today</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className={selectClass}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <TransactionTable
        transactions={filtered}
        onEdit={(t) => { setEditing(t); setDefaultType(t.type); setModalOpen(true); }}
        onDelete={handleDelete}
      />

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

export default Transactions;
