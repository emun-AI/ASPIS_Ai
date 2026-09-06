import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/aspis/kit";
import { BellRing, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASPIS Ai — Your AI Health Companion in Uganda" },
      {
        name: "description",
        content:
          "Personalised health predictions, smart reminders and doctor-approved recommendations for UGX 10,000 per month.",
      },
      { property: "og:title", content: "ASPIS Ai — Your AI Health Companion" },
      {
        property: "og:description",
        content: "AI health insights reviewed by real doctors. Sign up in minutes for UGX 10,000 a month.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: HeartPulse, title: "AI health predictions", body: "Spot trends in your vitals before they become problems." },
  { icon: Stethoscope, title: "Doctor review & approval", body: "Every recommendation is checked by a real clinician." },
  { icon: BellRing, title: "Smart reminders", body: "Medication, check-ins and appointments, right on time." },
  { icon: ShieldCheck, title: "Private by design", body: "Your health data stays yours, always encrypted." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Logo />
        <Link to="/onboarding" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Login
        </Link>
      </header>

      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            UGX 10,000 / month
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Your AI Health Companion
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Personalised predictions, smart reminders and doctor-approved recommendations for better health
            outcomes.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              to="/onboarding"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link to="/dashboard" className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
              View demo dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-brand-ink p-8 text-background">
          <Logo className="text-background" />
          <p className="mt-6 text-sm text-background/70">Health Score</p>
          <p className="text-4xl font-bold text-primary">Good</p>
          <p className="text-sm text-background/60">72 / 100</p>
          <div className="mt-6 space-y-2 text-sm">
            {["2 medications due today", "3 upcoming reminders", "Check-ins pending"].map((line) => (
              <div key={line} className="rounded-md bg-background/10 px-3 py-2 text-background/85">
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-5">
            <f.icon className="size-5 text-primary" />
            <h2 className="mt-3 text-sm font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
