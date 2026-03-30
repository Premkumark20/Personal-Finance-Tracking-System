import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Transaction } from "@/lib/transactions";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
      <div className="h-[200px] sm:h-[220px] md:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="45%" 
              innerRadius={isMobile ? 30 : 40} 
              outerRadius={isMobile ? 50 : 80} 
              dataKey="value" 
              paddingAngle={2}
            >
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
            <Legend 
              verticalAlign="bottom" 
              height={isMobile ? 80 : 60}
              formatter={(value) => <span className="text-xs">{value}</span>}
              wrapperStyle={{
                fontSize: isMobile ? '9px' : '10px',
                paddingTop: '10px'
              }}
              iconSize={isMobile ? 8 : 12}
              layout={isMobile ? "horizontal" : "horizontal"}
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
