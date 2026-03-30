import { useState, useMemo, useEffect } from "react";
import { transactionStore } from "@/lib/transactions";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from "recharts";

type View = "monthly" | "daily" | "yearly";

const Summary = () => {
  const [view, setView] = useState<View>("monthly");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionStore.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const data = useMemo(() => {
    const groups: Record<string, { key: string; income: number; expense: number; balance: number }> = {};

    transactions.forEach((t) => {
      let key: string;
      if (view === "daily") key = t.date;
      else if (view === "monthly") key = t.date.slice(0, 7);
      else key = t.date.slice(0, 4);

      if (!groups[key]) groups[key] = { key, income: 0, expense: 0, balance: 0 };
      if (t.type === "income") groups[key].income += t.amount;
      else groups[key].expense += t.amount;
      groups[key].balance = groups[key].income - groups[key].expense;
    });

    return Object.values(groups).sort((a, b) => a.key.localeCompare(b.key));
  }, [transactions, view]);

  const selectClass =
    "px-3 py-1.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading summary...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-lg sm:text-xl font-semibold">Summary</h1>
        <select value={view} onChange={(e) => setView(e.target.value as View)} className={selectClass}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-4 sm:p-6 surface-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Income vs Expenses ({view})
          </h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="key" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend />
                <Bar dataKey="income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 sm:p-6 surface-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Balance Trend ({view})
          </h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="key" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
