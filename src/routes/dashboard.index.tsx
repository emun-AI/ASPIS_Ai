import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Panel, TextInput } from "@/components/aspis/kit";
import { useAspis } from "@/lib/aspis-store";
import { Bell, ChevronRight, FileText, Pill, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Your health dashboard — ASPIS Ai" },
      { name: "description", content: "Track your health score, medications, reminders and daily readings." },
      { property: "og:title", content: "Your health dashboard — ASPIS Ai" },
      { property: "og:description", content: "Health score, medications, reminders and readings in one place." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const { state, update } = useAspis();
  const [type, setType] = useState("Blood Pressure");
  const [value, setValue] = useState("");
  const firstName = state.fullName.split(" ")[0] || "Jane";

  const addReading = () => {
    if (!value.trim()) return;
    update({
      readings: [
        { id: crypto.randomUUID(), type, value, when: "Just now" },
        ...state.readings,
      ],
    });
    setValue("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hello, {firstName} 👋</h1>
        <p className="text-sm text-muted-foreground">Here's your health overview</p>
      </div>

      <Panel className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Health Score</p>
          <p className="text-3xl font-bold text-primary">Good</p>
          <p className="text-sm text-muted-foreground">72 / 100</p>
        </div>
        <div className="relative grid size-20 place-items-center">
          <svg viewBox="0 0 36 36" className="size-20 -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="var(--secondary)" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="72 100"
              pathLength={100}
            />
          </svg>
          <span className="absolute text-sm font-semibold">72</span>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: Pill, title: "Medications", note: "2 due", to: "/dashboard/insights" as const },
          { icon: Bell, title: "Reminders", note: "3 upcoming", to: "/dashboard/insights" as const },
          { icon: FileText, title: "Check-ins", note: "Pending", to: "/dashboard/analysis" as const },
          { icon: FileText, title: "Reports", note: "View latest", to: "/dashboard/history" as const },
        ].map((c) => (
          <Link key={c.title} to={c.to}>
            <Panel className="flex items-center gap-3 transition hover:border-primary/50">
              <c.icon className="size-5 text-primary" />
              <span className="flex-1">
                <span className="block text-sm font-semibold">{c.title}</span>
                <span className="block text-xs text-muted-foreground">{c.note}</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Panel>
          </Link>
        ))}
      </div>

      <Panel>
        <h2 className="text-sm font-semibold">Log Your Health Data</h2>
        <p className="text-xs text-muted-foreground">Keep your data updated for better predictions</p>
        <div className="mt-4 space-y-2">
          {state.readings.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2">
              <span>
                <span className="block text-sm font-medium">{r.type}</span>
                <span className="block text-xs text-muted-foreground">{r.value}</span>
              </span>
              <span className="text-xs text-muted-foreground">{r.when}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-md border border-input bg-card px-3 py-2 text-sm"
          >
            {["Blood Pressure", "Blood Sugar", "Weight", "CD4 Count (HIV)", "Symptom"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <TextInput
            value={value}
            placeholder="e.g. 120/80 mmHg"
            onChange={(e) => setValue(e.target.value)}
            className="flex-1"
          />
          <Btn className="sm:w-auto" onClick={addReading}>
            <Plus className="mr-1 size-4" /> Add New
          </Btn>
        </div>
      </Panel>
    </div>
  );
}
