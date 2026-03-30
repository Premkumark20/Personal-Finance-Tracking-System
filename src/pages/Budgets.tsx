import { useState, useMemo, useEffect } from "react";
import { transactionStore, type Transaction } from "@/lib/transactions";
import { database } from "@/lib/database";
import { getCategoriesForType, getCategoryConfig } from "@/lib/categories";

interface Budget {
  category: string;
  limit: number;
}

const EXPENSE_CATEGORIES = getCategoriesForType("expense").map((c) => c.name);

const Budgets = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [limit, setLimit] = useState("");

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const budgetData = await database.getAllBudgets();
      const transactionData = await transactionStore.getAll();
      setBudgets(budgetData);
      setTransactions(transactionData);
    } catch (error) {
      console.error('Failed to load budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const spending = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions, currentMonth]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit) return;
    try {
      await database.createBudget(category, parseFloat(limit));
      await loadBudgets();
      setLimit("");
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const handleRemove = async (cat: string) => {
    try {
      await database.deleteBudget(cat);
      await loadBudgets();
    } catch (error) {
      console.error('Failed to remove budget:', error);
    }
  };

  const selectClass =
    "px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading budgets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-4">
      <h1 className="text-lg sm:text-xl font-semibold mb-6">Budgets</h1>

      <form onSubmit={handleAdd} className="bg-card rounded-lg p-4 sm:p-6 surface-card mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass + " w-full"}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          </div>
          <div className="sm:w-32">
            <label className="block text-sm font-medium mb-1">Monthly Limit (₹)</label>
            <input
              type="number"
              step="0.01"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className={selectClass + " w-full"}
              placeholder="500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground transition-fast hover:brightness-110 w-full sm:w-auto"
        >
          Set Budget
        </button>
      </form>

      {budgets.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No budgets set. Add one above.</p>
      ) : (
        <div className="space-y-4">
          {budgets.map((b) => {
            const spent = spending[b.category] || 0;
            const pct = Math.min((spent / b.limit) * 100, 100);
            const over = spent > b.limit;
            const cat = getCategoryConfig(b.category);
            const Icon = cat?.icon;

            return (
              <div key={b.category} className="bg-card rounded-lg p-4 sm:p-5 surface-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium inline-flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4" style={{ color: cat?.color }} />}
                    {b.category}
                  </span>
                  <button onClick={() => handleRemove(b.category)} className="text-xs text-destructive hover:underline">
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>₹{spent.toFixed(2)} spent</span>
                  <span>₹{b.limit.toFixed(2)} limit</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-destructive" : "bg-income"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {over && (
                  <p className="text-xs text-destructive mt-1">
                    Over budget by ₹{(spent - b.limit).toFixed(2)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Budgets;
