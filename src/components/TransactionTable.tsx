import type { Transaction } from "@/lib/transactions";
import { getCategoryConfig } from "@/lib/categories";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionTable = ({ transactions, onEdit, onDelete }: TransactionTableProps) => {
  return (
    <div className="bg-card rounded-lg surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-left">
        <thead>
          <tr className="bg-secondary">
            <th className="px-1 sm:px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium w-[60px]">Date</th>
            <th className="px-1 sm:px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium min-w-[70px]">Title</th>
            <th className="px-1 sm:px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium min-w-[70px]">Category</th>
            <th className="px-1 sm:px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium text-right w-[80px]">Amount</th>
            <th className="px-1 sm:px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium text-center w-[60px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan={5} className="px-1 sm:px-2 py-6 text-center text-muted-foreground text-xs">
                No transactions yet.
              </td>
            </tr>
          )}
          {transactions.map((t) => {
            const cat = getCategoryConfig(t.category);
            const Icon = cat?.icon;
            return (
              <tr key={t.id} className="border-t border-border">
                <td className="px-1 sm:px-2 py-2 text-xs">{t.date}</td>
                <td className="px-1 sm:px-2 py-2 text-xs font-medium truncate max-w-[70px]" title={t.title}>{t.title}</td>
                <td className="px-1 sm:px-2 py-2 text-xs">
                  <span className="inline-flex items-center gap-1 bg-secondary px-1 py-0.5 rounded text-xs truncate max-w-[70px]">
                    {Icon && <Icon className="h-3 w-3" style={{ color: cat?.color }} />}
                    <span className="truncate">{t.category}</span>
                  </span>
                </td>
                <td className={`px-1 sm:px-2 py-2 text-xs font-semibold tabular-nums font-mono text-right ${t.type === "income" ? "text-income" : "text-destructive"}`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                </td>
                <td className="px-1 sm:px-2 py-2 text-xs space-x-0.5 text-center">
                  <button
                    onClick={() => onEdit(t)}
                    className="px-1 py-0.5 text-xs rounded surface-card transition-fast hover:bg-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="px-1 py-0.5 text-xs rounded surface-card text-destructive transition-fast hover:bg-secondary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TransactionTable;
