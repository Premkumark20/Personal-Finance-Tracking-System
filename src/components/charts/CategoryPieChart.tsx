import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Transaction } from "@/lib/transactions";

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(160, 84%, 39%)",
  "hsl(0, 84%, 60%)",
  "hsl(45, 93%, 47%)",
  "hsl(280, 67%, 55%)",
  "hsl(190, 80%, 42%)",
];

interface Props {
  transactions: Transaction[];
}

export default function CategoryPieChart({ transactions }: Props) {
  const catMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

  const data = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-3 sm:p-4 surface-card flex items-center justify-center h-[200px] sm:h-[250px]">
        <p className="text-muted-foreground text-xs sm:text-sm">No expense data to show</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-3 sm:p-4 surface-card">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-4">Expenses by Category</h3>
      <div className="h-[180px] sm:h-[200px] md:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 10,
              }}
              formatter={(val: number) => `₹${val.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
