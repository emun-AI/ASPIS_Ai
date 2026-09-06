import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Field, Panel, SelectInput, StepShell, TextInput } from "@/components/aspis/kit";
import { useAspis } from "@/lib/aspis-store";
import { Check, HeartPulse, Stethoscope, User, Watch } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Create your ASPIS Ai account" },
      { name: "description", content: "Sign up, verify your phone and set up your health profile on ASPIS Ai." },
      { property: "og:title", content: "Create your ASPIS Ai account" },
      { property: "og:description", content: "Sign up, verify your phone and set up your health profile." },
    ],
  }),
  component: Onboarding,
});

const TOTAL = 6;
const CONDITIONS = ["HIV", "Sickle Cell", "Diabetes", "Hypertension"];
const SOURCES = [
  { name: "Google Fit", note: "Sync activity, steps, heart rate", icon: HeartPulse },
  { name: "Apple Health", note: "Sync activity, steps, heart rate", icon: HeartPulse },
  { name: "Smart Devices", note: "Connect BP monitor, glucometer, etc.", icon: Watch },
];

function Onboarding() {
  const { state, update } = useAspis();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [agreed, setAgreed] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL));

  if (step === 1)
    return (
      <StepShell step={1} total={TOTAL} title="I am a..." subtitle="Choose your account type">
        {(
          [
            { key: "patient", title: "Patient", note: "Manage my health with ASPIS Ai", icon: User },
            { key: "doctor", title: "Doctor", note: "Review and approve AI recommendations", icon: Stethoscope },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            onClick={() => update({ accountType: opt.key })}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
              state.accountType === opt.key ? "border-primary bg-accent/50" : "border-border hover:bg-secondary"
            }`}
          >
            <opt.icon className="size-5 text-muted-foreground" />
            <span className="flex-1">
              <span className="block text-sm font-semibold">{opt.title}</span>
              <span className="block text-xs text-muted-foreground">{opt.note}</span>
            </span>
            {state.accountType === opt.key && <Check className="size-4 text-primary" />}
          </button>
        ))}
        <Btn onClick={next}>Next</Btn>
      </StepShell>
    );

  if (step === 2)
    return (
      <StepShell step={2} total={TOTAL} title="Create your account">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name">
            <TextInput
              value={state.fullName}
              placeholder="Jane Namburio"
              onChange={(e) => update({ fullName: e.target.value })}
            />
          </Field>
          <Field label="Phone Number">
            <TextInput
              value={state.phone}
              placeholder="+256 700 123456"
              onChange={(e) => update({ phone: e.target.value })}
            />
          </Field>
          <Field label="Email (optional)">
            <TextInput
              value={state.email}
              placeholder="jane@example.com"
              onChange={(e) => update({ email: e.target.value })}
            />
          </Field>
          <Field label="Password">
            <TextInput type="password" placeholder="••••••••" />
          </Field>
        </div>
        <Field label="Confirm Password">
          <TextInput type="password" placeholder="••••••••" />
        </Field>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-[oklch(0.56_0.14_150)]"
          />
          I agree to the <span className="text-primary">Terms &amp; Conditions</span> and{" "}
          <span className="text-primary">Privacy Policy</span>
        </label>
        <Btn disabled={!agreed || !state.fullName || !state.phone} onClick={next}>
          Sign Up
        </Btn>
      </StepShell>
    );

  if (step === 3)
    return (
      <StepShell
        step={3}
        total={TOTAL}
        title="Verify your phone number"
        subtitle={`We have sent a 6-digit code to ${state.phone || "+256 700 123456"}`}
      >
        <div className="flex justify-between gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setOtp((prev) => prev.map((d, idx) => (idx === i ? v : d)));
              }}
              className="h-12 w-full rounded-md border border-input bg-card text-center text-lg font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
            />
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">Resend code in 00:30</p>
        <Btn disabled={otp.some((d) => !d)} onClick={next}>
          Verify
        </Btn>
      </StepShell>
    );

  if (step === 4)
    return (
      <StepShell step={4} total={TOTAL} title="Tell us about yourself" subtitle="Help us personalise your experience">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date of Birth">
            <TextInput type="date" value={state.dob} onChange={(e) => update({ dob: e.target.value })} />
          </Field>
          <Field label="Gender">
            <SelectInput value={state.gender} onChange={(e) => update({ gender: e.target.value })}>
              {["Female", "Male", "Prefer not to say"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <Field label="Location">
          <SelectInput value={state.location} onChange={(e) => update({ location: e.target.value })}>
            {["Kampala, Uganda", "Gulu, Uganda", "Mbarara, Uganda", "Jinja, Uganda"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </SelectInput>
        </Field>
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Primary Condition (Select all that apply)</p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => {
              const active = state.conditions.includes(c);
              return (
                <button
                  key={c}
                  onClick={() =>
                    update({
                      conditions: active ? state.conditions.filter((x) => x !== c) : [...state.conditions, c],
                    })
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
        <Btn onClick={next}>Next</Btn>
      </StepShell>
    );

  if (step === 5)
    return (
      <StepShell step={5} total={TOTAL} title="Your Health Summary" subtitle="Help us personalise your experience">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Height (cm)">
            <TextInput value={state.height} onChange={(e) => update({ height: e.target.value })} />
          </Field>
          <Field label="Weight (kg)">
            <TextInput value={state.weight} onChange={(e) => update({ weight: e.target.value })} />
          </Field>
        </div>
        <Field label="Blood Group">
          <SelectInput value={state.bloodGroup} onChange={(e) => update({ bloodGroup: e.target.value })}>
            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </SelectInput>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Do you smoke?">
            <SelectInput value={state.smokes} onChange={(e) => update({ smokes: e.target.value })}>
              <option>No</option>
              <option>Yes</option>
            </SelectInput>
          </Field>
          <Field label="Do you drink alcohol?">
            <SelectInput value={state.drinks} onChange={(e) => update({ drinks: e.target.value })}>
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </SelectInput>
          </Field>
        </div>
        <Btn onClick={next}>Next</Btn>
      </StepShell>
    );

  return (
    <StepShell
      step={6}
      total={TOTAL}
      title="Connect your health data"
      subtitle="Sync devices and apps to get better insights"
      footer={
        <>
          <Btn onClick={() => navigate({ to: "/dashboard" })}>Next</Btn>
          <Btn variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
            I will do this later
          </Btn>
        </>
      }
    >
      {SOURCES.map((s) => {
        const connected = state.connected.includes(s.name);
        return (
          <Panel key={s.name} className="flex items-center gap-3 p-3">
            <s.icon className="size-5 text-primary" />
            <span className="flex-1">
              <span className="block text-sm font-semibold">{s.name}</span>
              <span className="block text-xs text-muted-foreground">{s.note}</span>
            </span>
            <button
              onClick={() =>
                update({
                  connected: connected ? state.connected.filter((x) => x !== s.name) : [...state.connected, s.name],
                })
              }
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                connected ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {connected ? "Connected" : "Connect"}
            </button>
          </Panel>
        );
      })}
    </StepShell>
  );
}
