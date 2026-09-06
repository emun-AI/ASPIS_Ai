import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Btn, Panel } from "@/components/aspis/kit";
import { useAspis } from "@/lib/aspis-store";
import { Activity, CheckCircle2, Clock, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/dashboard/analysis")({
  head: () => ({
    meta: [
      { title: "AI analysis & doctor review — ASPIS Ai" },
      {
        name: "description",
        content: "See AI-generated health recommendations and follow them through doctor review and approval.",
      },
      { property: "og:title", content: "AI analysis & doctor review — ASPIS Ai" },
      { property: "og:description", content: "AI recommendations reviewed and approved by a real doctor." },
    ],
  }),
  component: Analysis,
});

const RECS = [
  { title: "Medication Adjustment", body: "Take your ARV medication at the same time daily." },
  { title: "Lifestyle Advice", body: "Increase physical activity to 30 minutes daily." },
  { title: "Monitoring", body: "Check your blood pressure twice this week." },
];

const STAGES = ["Analysing your health trends", "Checking for potential risks", "Preparing recommendations"];

function Analysis() {
  const { state, update } = useAspis();
  const [phase, setPhase] = useState<"idle" | "running" | "pending" | "review" | "approved">(
    state.doctorApproved ? "approved" : "idle",
  );
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setStage((s) => s + 1), 1100);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && stage >= STAGES.length) {
      setPhase("pending");
      update({ aiDone: true });
    }
  }, [phase, stage, update]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">AI Analysis</h1>

      {phase === "idle" && (
        <Panel className="text-center">
          <Activity className="mx-auto size-8 text-primary" />
          <p className="mt-3 text-sm font-semibold">Run an analysis on your latest data</p>
          <p className="text-xs text-muted-foreground">
            ASPIS Ai reviews your readings and prepares recommendations for a doctor to approve.
          </p>
          <Btn
            className="mt-4"
            onClick={() => {
              setStage(0);
              setPhase("running");
            }}
          >
            Start analysis
          </Btn>
        </Panel>
      )}

      {phase === "running" && (
        <Panel className="text-center">
          <div className="mx-auto grid size-24 animate-pulse place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            ASPIS Ai
          </div>
          <p className="mt-4 text-sm font-semibold">ASPIS Ai is analysing your data</p>
          <p className="text-xs text-muted-foreground">This may take a few seconds</p>
          <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left text-sm">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <CheckCircle2 className={`size-4 ${i < stage ? "text-primary" : "text-border"}`} />
                <span className={i < stage ? "text-foreground" : "text-muted-foreground"}>{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Please wait...</p>
        </Panel>
      )}

      {(phase === "pending" || phase === "review" || phase === "approved") && (
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recommendations</h2>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                phase === "approved" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {phase === "approved" ? "Approved" : phase === "review" ? "In review" : "Pending doctor review"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            ASPIS Ai has generated recommendations for you. A doctor will review and approve them.
          </p>
          <div className="mt-4 space-y-2">
            {RECS.map((r) => (
              <div key={r.title} className="rounded-md border border-border p-3">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
          {phase === "pending" && (
            <Btn className="mt-4" onClick={() => setPhase("review")}>
              Send to doctor
            </Btn>
          )}
          {phase === "pending" && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              These recommendations are not final until approved by a doctor.
            </p>
          )}
        </Panel>
      )}

      {phase === "review" && (
        <Panel className="text-center">
          <Clock className="mx-auto size-7 text-primary" />
          <p className="mt-2 text-sm font-semibold">In Review</p>
          <p className="text-xs text-muted-foreground">A doctor is reviewing your recommendations.</p>
          <p className="mt-3 text-sm font-medium">Estimated time: 2 – 6 hours</p>
          <Btn
            className="mt-4"
            onClick={() => {
              setPhase("approved");
              update({ doctorApproved: true });
            }}
          >
            Simulate doctor approval
          </Btn>
        </Panel>
      )}

      {phase === "approved" && (
        <Panel>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-accent">
              <Stethoscope className="size-4 text-primary" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Notes from Dr. A. Muwanga</span>
              <span className="block text-xs text-muted-foreground">General Practitioner</span>
            </span>
          </div>
          <p className="mt-4 text-sm">
            Great job staying consistent! Keep monitoring your health and reach out if you notice any changes. Stay
            healthy!
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Approved · 10:30 AM</p>
        </Panel>
      )}
    </div>
  );
}
