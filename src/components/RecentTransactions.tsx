import type { Transaction } from "@/lib/transactions";
import { getCategoryConfig } from "@/lib/categories";

interface Props {
  transactions: Transaction[];
  limit?: number;
}

export default function RecentTransactions({ transactions, limit = 5 }: Props) {
  const recent = transactions.slice(0, limit);

  return (
    <div className="bg-card rounded-lg p-3 sm:p-4 surface-card">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-4">Recent Transactions</h3>
      {recent.length === 0 ? (
        <p className="text-muted-foreground text-xs sm:text-sm text-center py-6 sm:py-8">No transactions yet</p>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {recent.map((t) => {
            const cat = getCategoryConfig(t.category);
            const Icon = cat?.icon;
            return (
              <div key={t.id} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  {Icon && (
                    <div
                      className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-lg"
                      style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-medium">{t.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.category} · {t.date}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold tabular-nums font-mono ${
                    t.type === "income" ? "text-income" : "text-destructive"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
