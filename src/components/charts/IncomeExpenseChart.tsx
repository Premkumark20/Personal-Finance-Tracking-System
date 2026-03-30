import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Transaction } from "@/lib/transactions";

interface Props {
  transactions: Transaction[];
}

export default function IncomeExpenseChart({ transactions }: Props) {
  const monthly: Record<string, { month: string; income: number; expense: number }> = {};

  transactions.forEach((t) => {
    const m = t.date.slice(0, 7); // YYYY-MM
    if (!monthly[m]) monthly[m] = { month: m, income: 0, expense: 0 };
    if (t.type === "income") monthly[m].income += t.amount;
    else monthly[m].expense += t.amount;
  });

  const data = Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

  return (
    <div className="bg-card rounded-lg p-3 sm:p-4 surface-card">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-4">Income vs Expenses</h3>
      <div className="h-[180px] sm:h-[200px] md:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 10,
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
