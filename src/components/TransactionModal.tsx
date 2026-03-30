import { useState, useEffect } from "react";
import type { Transaction } from "@/lib/transactions";
import { getCategoriesForType } from "@/lib/categories";

interface TransactionModalProps {
  open: boolean;
  transaction: Transaction | null;
  defaultType?: "income" | "expense";
  onClose: () => void;
  onSave: (data: Omit<Transaction, "id">) => void;
}

const TransactionModal = ({ open, transaction, defaultType = "expense", onClose, onSave }: TransactionModalProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const categories = getCategoriesForType(type);

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setType(transaction.type);
      setDate(transaction.date);
      setNotes(transaction.notes || "");
    } else {
      const t = defaultType;
      setTitle("");
      setAmount("");
      setType(t);
      const cats = getCategoriesForType(t);
      setCategory(cats[0]?.name || "Other");
      setDate(new Date().toISOString().slice(0, 10));
      setNotes("");
    }
  }, [transaction, open, defaultType]);

  // When type changes, reset category to first valid option
  useEffect(() => {
    const cats = getCategoriesForType(type);
    if (!cats.find((c) => c.name === category)) {
      setCategory(cats[0]?.name || "Other");
    }
  }, [type]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      amount: parseFloat(amount),
      category,
      type,
      date,
      notes: notes || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl p-8 w-full max-w-md surface-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-6">
          {transaction ? "Edit Transaction" : type === "income" ? "Add Income" : "Add Expense"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grocery Store"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "income" | "expense")}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium surface-card transition-fast hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-fast hover:brightness-110 ${
                type === "income"
                  ? "bg-income text-primary-foreground"
                  : "bg-destructive text-destructive-foreground"
              }`}
            >
              {transaction ? "Update" : type === "income" ? "Add Income" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
