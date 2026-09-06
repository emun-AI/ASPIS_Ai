import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Activity, BarChart3, History, Home, Sparkles, User } from "lucide-react";

export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      {mark && (
        <span className="grid size-7 place-items-center rounded-full border-2 border-primary text-primary">
          <Activity className="size-3.5" strokeWidth={3} />
        </span>
      )}
      <span>
        ASPIS <span className="text-primary">Ai</span>
      </span>
    </span>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>{children}</div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const control =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25 placeholder:text-muted-foreground/70";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(control, "appearance-none pr-8", props.className)} />;
}

export function Btn({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-border bg-card text-foreground hover:bg-secondary",
        variant === "ghost" && "text-muted-foreground hover:text-foreground",
        className,
      )}
    />
  );
}

export function StepShell({
  step,
  total,
  title,
  subtitle,
  children,
  footer,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <span className="text-xs font-medium text-muted-foreground">
          Step {step} of {total}
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <Panel className="p-6">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-5 space-y-4">{children}</div>
        {footer && <div className="mt-6 space-y-3">{footer}</div>}
      </Panel>
    </div>
  );
}

const nav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/analysis", label: "AI Analysis", icon: Sparkles },
  { to: "/dashboard/insights", label: "Insights", icon: BarChart3 },
  { to: "/dashboard/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col bg-sidebar p-4 text-sidebar-foreground sm:flex">
        <Logo className="mb-8 text-sidebar-foreground" />
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                pathname === item.to
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/subscription"
          className="mt-auto rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent/80"
        >
          <span className="block font-semibold text-sidebar-primary">Monthly Plan</span>
          UGX 10,000 / month
        </Link>
      </aside>
      <div className="flex-1">
        <nav className="flex gap-1 overflow-x-auto bg-sidebar px-3 py-2 sm:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-xs text-sidebar-foreground/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto w-full max-w-3xl px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
