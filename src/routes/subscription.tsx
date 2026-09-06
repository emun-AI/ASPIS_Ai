import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Btn, Field, Panel, StepShell, TextInput } from "@/components/aspis/kit";
import { useAspis } from "@/lib/aspis-store";
import { Building2, Check, CheckCircle2, CreditCard, Smartphone } from "lucide-react";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Subscribe to ASPIS Ai — UGX 10,000 per month" },
      {
        name: "description",
        content: "Pay with MTN or Airtel Mobile Money, card or bank transfer and activate your ASPIS Ai plan.",
      },
      { property: "og:title", content: "Subscribe to ASPIS Ai — UGX 10,000 / month" },
      { property: "og:description", content: "Mobile money, card or bank transfer. Activate your plan in minutes." },
    ],
  }),
  component: Subscription,
});

const TOTAL = 5;
const METHODS = [
  { name: "Mobile Money (MTN)", icon: Smartphone },
  { name: "Airtel Money", icon: Smartphone },
  { name: "Card Payment", icon: CreditCard },
  { name: "Bank Transfer", icon: Building2 },
];

function Subscription() {
  const { state, update } = useAspis();
  const navigate = useNavigate();
  const [step, setStep] = useState(state.subscribed ? 6 : 1);
  const [seconds, setSeconds] = useState(60);
  const [phone, setPhone] = useState(state.phone || "+256 700 123456");

  useEffect(() => {
    if (step !== 4) return;
    setSeconds(60);
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const price = state.plan === "monthly" ? "UGX 10,000" : "UGX 100,000";

  if (step === 1)
    return (
      <StepShell step={1} total={TOTAL} title="Choose Your Plan" subtitle="Get the best out of ASPIS Ai">
        {(
          [
            { key: "monthly", label: "Monthly Plan", price: "UGX 10,000 / month", note: "" },
            { key: "yearly", label: "Yearly Plan", price: "UGX 100,000 / year", note: "Save 2 months" },
          ] as const
        ).map((p) => (
          <button
            key={p.key}
            onClick={() => update({ plan: p.key })}
            className={`w-full rounded-lg border p-4 text-left transition ${
              state.plan === p.key ? "border-primary bg-accent/40" : "border-border hover:bg-secondary"
            }`}
          >
            <span className="flex items-center justify-between">
              <span className="text-sm font-semibold">{p.label}</span>
              {state.plan === p.key && <Check className="size-4 text-primary" />}
            </span>
            <span className="mt-1 block text-lg font-bold text-primary">{p.price}</span>
            {p.note && <span className="text-xs text-muted-foreground">{p.note}</span>}
          </button>
        ))}
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {["AI health predictions", "Doctor review & approval", "Smart reminders", "Health insights & trends", "Priority support"].map(
            (f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-3.5 text-primary" /> {f}
              </li>
            ),
          )}
        </ul>
        <Btn onClick={() => setStep(2)}>Continue</Btn>
      </StepShell>
    );

  if (step === 2)
    return (
      <StepShell step={2} total={TOTAL} title="Select Payment Method">
        {METHODS.map((m) => (
          <button
            key={m.name}
            onClick={() => update({ paymentMethod: m.name })}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
              state.paymentMethod === m.name ? "border-primary bg-accent/40" : "border-border hover:bg-secondary"
            }`}
          >
            <m.icon className="size-5 text-primary" />
            <span className="flex-1 text-sm font-medium">{m.name}</span>
            {state.paymentMethod === m.name && <Check className="size-4 text-primary" />}
          </button>
        ))}
        <Btn onClick={() => setStep(3)}>Continue</Btn>
      </StepShell>
    );

  if (step === 3)
    return (
      <StepShell
        step={3}
        total={TOTAL}
        title={`Pay with ${state.paymentMethod}`}
        subtitle="Enter the details to complete payment"
      >
        <Field label="Phone Number">
          <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Amount">
          <TextInput value={price} readOnly />
        </Field>
        <p className="text-xs text-muted-foreground">
          You will receive a prompt on your phone to complete the payment.
        </p>
        <Btn onClick={() => setStep(4)}>Pay Now</Btn>
      </StepShell>
    );

  if (step === 4)
    return (
      <StepShell
        step={4}
        total={TOTAL}
        title="Complete Payment"
        subtitle="Check your phone and enter your PIN to authorise payment"
      >
        <p className="text-center text-3xl font-bold">{price}</p>
        <div className="mx-auto grid size-24 place-items-center rounded-full border-4 border-primary/30">
          <span className="text-xl font-semibold text-primary">{seconds}</span>
        </div>
        <p className="text-center text-xs text-muted-foreground">seconds remaining</p>
        <Btn
          onClick={() => {
            update({ subscribed: true });
            setStep(5);
          }}
        >
          I have authorised the payment
        </Btn>
        <Btn variant="outline" onClick={() => setSeconds(60)}>
          Didn't receive a prompt? Resend
        </Btn>
      </StepShell>
    );

  if (step === 5)
    return (
      <StepShell step={5} total={TOTAL} title="Payment Successful!" subtitle="Thank you for choosing ASPIS Ai">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <p className="text-center text-sm">
          You are now subscribed to the{" "}
          <span className="font-semibold">{state.plan === "monthly" ? "Monthly" : "Yearly"} Plan</span> — {price}
        </p>
        <Btn onClick={() => navigate({ to: "/dashboard" })}>Go to Dashboard</Btn>
        <Btn variant="outline" onClick={() => setStep(6)}>
          View subscription
        </Btn>
      </StepShell>
    );

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <Panel>
        <h1 className="text-lg font-semibold">Subscription Active</h1>
        <p className="text-sm text-muted-foreground">Your plan is active and you're all set</p>
        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium">{state.plan === "monthly" ? "Monthly Plan" : "Yearly Plan"}</p>
          <p className="text-lg font-bold text-primary">{price}</p>
          <p className="mt-1 text-xs text-muted-foreground">Next payment date: 11 June 2026</p>
        </div>
        <div className="mt-4 space-y-2">
          <Btn variant="outline" onClick={() => setStep(2)}>
            Update payment method
          </Btn>
          <Btn variant="ghost" onClick={() => update({ subscribed: false })}>
            Cancel subscription
          </Btn>
          <Btn onClick={() => navigate({ to: "/dashboard" })}>Done</Btn>
        </div>
      </Panel>
    </div>
  );
}
