interface SummaryCardProps {
  label: string;
  value: string;
  variant?: "default" | "income" | "expense";
}

const SummaryCard = ({ label, value, variant = "default" }: SummaryCardProps) => {
  const colorClass =
    variant === "income"
      ? "text-income"
      : variant === "expense"
        ? "text-destructive"
        : "text-foreground";

  return (
    <div className="bg-card rounded-lg p-3 sm:p-4 surface-card">
      <div className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</div>
      <div className={`text-xl sm:text-2xl md:text-3xl font-bold tabular-nums mt-1 sm:mt-2 ${colorClass}`}>
        {value}
      </div>
    </div>
  );
};

export default SummaryCard;
