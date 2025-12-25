import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  color: "primary" | "accent" | "sage" | "terracotta";
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  sage: "bg-sage/10 text-sage",
  terracotta: "bg-terracotta/10 text-terracotta",
};

const iconBgClasses = {
  primary: "bg-primary",
  accent: "bg-accent",
  sage: "bg-sage",
  terracotta: "bg-terracotta",
};

export const StatsCard = ({ label, value, icon: Icon, trend, color }: StatsCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
          }`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};
