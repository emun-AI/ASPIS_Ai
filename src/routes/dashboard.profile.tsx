import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn, Panel } from "@/components/aspis/kit";
import { useAspis } from "@/lib/aspis-store";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — ASPIS Ai" },
      { name: "description", content: "Review your personal details, health summary and subscription." },
      { property: "og:title", content: "Your profile — ASPIS Ai" },
      { property: "og:description", content: "Personal details, health summary and subscription in one place." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { state, reset } = useAspis();
  const rows = [
    ["Full name", state.fullName || "Jane Namburio"],
    ["Phone", state.phone || "+256 700 123456"],
    ["Email", state.email || "jane@example.com"],
    ["Date of birth", state.dob],
    ["Gender", state.gender],
    ["Location", state.location],
    ["Conditions", state.conditions.join(", ") || "None selected"],
    ["Height / Weight", `${state.height} cm · ${state.weight} kg`],
    ["Blood group", state.bloodGroup],
    ["Smokes / Drinks", `${state.smokes} · ${state.drinks}`],
    ["Connected apps", state.connected.join(", ") || "None"],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <Panel>
        <div className="divide-y divide-border">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-right font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h2 className="text-sm font-semibold">Subscription</h2>
        <p className="text-xs text-muted-foreground">
          {state.subscribed ? "Monthly Plan · UGX 10,000 / month · Active" : "No active plan"}
        </p>
        <Link to="/subscription">
          <Btn className="mt-4" variant="outline">
            {state.subscribed ? "Manage subscription" : "Choose a plan"}
          </Btn>
        </Link>
      </Panel>

      <Btn variant="ghost" onClick={reset}>
        Reset demo data
      </Btn>
    </div>
  );
}
