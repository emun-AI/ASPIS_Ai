import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Panel, TextInput } from "@/components/aspis/kit";
import { useAspis } from "@/lib/aspis-store";
import { BellRing } from "lucide-react";

export const Route = createFileRoute("/dashboard/insights")({
  head: () => ({
    meta: [
      { title: "Reminders & adherence — ASPIS Ai" },
      { name: "description", content: "Customise your medication reminders and report whether you took your dose." },
      { property: "og:title", content: "Reminders & adherence — ASPIS Ai" },
      { property: "og:description", content: "Customise reminders and report medication adherence." },
    ],
  }),
  component: Insights,
});

const OPTIONS = ["Yes, I took it", "No, I missed it", "I'll take it later"];

function Insights() {
  const { state, update } = useAspis();
  const [saved, setSaved] = useState(false);
  const [answer, setAnswer] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>

      <Panel>
        <h2 className="text-sm font-semibold">Customise Reminders</h2>
        <p className="text-xs text-muted-foreground">Set reminders that work for you</p>
        <div className="mt-4 space-y-3">
          {Object.entries(state.reminders).map(([name, on]) => (
            <div key={name} className="flex items-center justify-between">
              <span className="text-sm">{name}</span>
              <button
                onClick={() => update({ reminders: { ...state.reminders, [name]: !on } })}
                aria-pressed={on}
                aria-label={name}
                className={`h-6 w-11 rounded-full p-0.5 transition ${on ? "bg-primary" : "bg-border"}`}
              >
                <span
                  className={`block size-5 rounded-full bg-card transition ${on ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 max-w-40">
          <span className="text-xs text-muted-foreground">Reminder time</span>
          <TextInput
            type="time"
            value={state.reminderTime}
            onChange={(e) => update({ reminderTime: e.target.value })}
          />
        </div>
        <Btn
          className="mt-4"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          {saved ? "Saved" : "Save"}
        </Btn>
      </Panel>

      <Panel className="bg-brand-ink text-background">
        <div className="flex items-center justify-between text-xs text-background/60">
          <span className="inline-flex items-center gap-2">
            <BellRing className="size-3.5" /> ASPIS Ai
          </span>
          <span>now</span>
        </div>
        <p className="mt-2 text-sm font-semibold">Time to take your medication</p>
        <p className="text-sm text-background/70">Don't forget your ARV medication.</p>
        <div className="mt-3 flex gap-2">
          <Btn variant="outline" className="bg-background/10 text-background">
            Taken
          </Btn>
          <Btn variant="outline" className="bg-background/10 text-background">
            Snooze (30 min)
          </Btn>
        </div>
      </Panel>

      <Panel>
        <h2 className="text-sm font-semibold">Did you take your medication?</h2>
        <p className="text-xs text-muted-foreground">ARV · 8:00 AM</p>
        <div className="mt-4 space-y-2">
          {OPTIONS.map((o) => (
            <button
              key={o}
              onClick={() => setAnswer(o)}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                answer === o ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <span className="text-xs text-muted-foreground">Add a note (optional)</span>
          <TextInput value={note} placeholder="How do you feel today?" onChange={(e) => setNote(e.target.value)} />
        </div>
        <Btn
          className="mt-4"
          disabled={!answer}
          onClick={() => {
            update({ adherence: [...state.adherence, { answer, note }] });
            setSubmitted(true);
            setNote("");
          }}
        >
          Submit
        </Btn>
        {submitted && <p className="mt-3 text-center text-xs text-primary">Thanks — your check-in was recorded.</p>}
      </Panel>
    </div>
  );
}
