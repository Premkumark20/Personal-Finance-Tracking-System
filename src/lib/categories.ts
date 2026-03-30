import {
  Utensils,
  Plane,
  Receipt,
  ShoppingBag,
  Briefcase,
  Home,
  Car,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  Gift,
  Wifi,
  Fuel,
  Baby,
  Dumbbell,
  DollarSign,
  TrendingUp,
  Landmark,
  Wallet,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
  name: string;
  icon: LucideIcon;
  type: "expense" | "income" | "both";
  color: string;
}

export const CATEGORIES: CategoryConfig[] = [
  // Expense categories
  { name: "Food", icon: Utensils, type: "expense", color: "hsl(25, 95%, 53%)" },
  { name: "Travel", icon: Plane, type: "expense", color: "hsl(200, 80%, 50%)" },
  { name: "Bills", icon: Receipt, type: "expense", color: "hsl(0, 70%, 55%)" },
  { name: "Shopping", icon: ShoppingBag, type: "expense", color: "hsl(280, 67%, 55%)" },
  { name: "Rent", icon: Home, type: "expense", color: "hsl(340, 65%, 50%)" },
  { name: "Transport", icon: Car, type: "expense", color: "hsl(210, 60%, 50%)" },
  { name: "Health", icon: HeartPulse, type: "expense", color: "hsl(350, 80%, 55%)" },
  { name: "Education", icon: GraduationCap, type: "expense", color: "hsl(250, 60%, 55%)" },
  { name: "Entertainment", icon: Gamepad2, type: "expense", color: "hsl(300, 60%, 50%)" },
  { name: "Gifts", icon: Gift, type: "expense", color: "hsl(330, 70%, 55%)" },
  { name: "Internet", icon: Wifi, type: "expense", color: "hsl(190, 70%, 45%)" },
  { name: "Fuel", icon: Fuel, type: "expense", color: "hsl(30, 80%, 45%)" },
  { name: "Kids", icon: Baby, type: "expense", color: "hsl(160, 50%, 50%)" },
  { name: "Fitness", icon: Dumbbell, type: "expense", color: "hsl(140, 60%, 45%)" },
  // Income categories
  { name: "Salary", icon: Briefcase, type: "income", color: "hsl(160, 84%, 39%)" },
  { name: "Freelance", icon: DollarSign, type: "income", color: "hsl(145, 70%, 40%)" },
  { name: "Investment", icon: TrendingUp, type: "income", color: "hsl(170, 60%, 42%)" },
  { name: "Business", icon: Landmark, type: "income", color: "hsl(180, 55%, 40%)" },
  { name: "Refund", icon: Wallet, type: "income", color: "hsl(130, 50%, 45%)" },
  // Both
  { name: "Other", icon: MoreHorizontal, type: "both", color: "hsl(220, 15%, 55%)" },
];

export function getCategoriesForType(type: "income" | "expense"): CategoryConfig[] {
  return CATEGORIES.filter((c) => c.type === type || c.type === "both");
}

export function getCategoryConfig(name: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.name === name);
}
