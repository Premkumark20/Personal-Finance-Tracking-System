import { useState, useMemo, useEffect } from "react";
import { transactionStore } from "@/lib/transactions";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const dailyData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    transactions
      .filter((t) => t.date.startsWith(prefix))
      .forEach((t) => {
        if (!map[t.date]) map[t.date] = { income: 0, expense: 0 };
        if (t.type === "income") map[t.date].income += t.amount;
        else map[t.date].expense += t.amount;
      });
    return map;
  }, [transactions, year, month]);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-4">
      <h1 className="text-lg sm:text-xl font-semibold mb-6">Calendar</h1>

      <div className="bg-card rounded-lg surface-card overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          <button onClick={prev} className="p-1 rounded hover:bg-secondary transition-fast">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold text-sm sm:text-base">{monthName}</span>
          <button onClick={next} className="p-1 rounded hover:bg-secondary transition-fast">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 overflow-x-auto">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1 sm:py-2 border-b border-border min-w-[30px]">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const dateStr = day
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : null;
            const dayData = dateStr ? dailyData[dateStr] : null;
            const isToday = dateStr === new Date().toISOString().slice(0, 10);

            return (
              <div
                key={i}
                className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-1.5 border-b border-r border-border text-xs min-w-[30px] ${
                  !day ? "bg-secondary/30" : ""
                } ${isToday ? "bg-primary/5" : ""}`}
              >
                {day && (
                  <>
                    <div className={`font-medium mb-1 ${isToday ? "text-primary font-bold" : "text-foreground"}`}>
                      {day}
                    </div>
                    {dayData && (
                      <div className="space-y-0.5">
                        {dayData.income > 0 && (
                          <div className="text-income text-[10px] tabular-nums">+₹{dayData.income.toFixed(0)}</div>
                        )}
                        {dayData.expense > 0 && (
                          <div className="text-destructive text-[10px] tabular-nums">-₹{dayData.expense.toFixed(0)}</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
