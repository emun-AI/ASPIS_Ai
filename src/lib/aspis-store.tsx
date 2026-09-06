import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Reading = { id: string; type: string; value: string; when: string };

export type AspisState = {
  accountType: "patient" | "doctor";
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  location: string;
  conditions: string[];
  height: string;
  weight: string;
  bloodGroup: string;
  smokes: string;
  drinks: string;
  connected: string[];
  readings: Reading[];
  reminders: Record<string, boolean>;
  reminderTime: string;
  adherence: { answer: string; note: string }[];
  aiDone: boolean;
  doctorApproved: boolean;
  plan: "monthly" | "yearly";
  paymentMethod: string;
  subscribed: boolean;
};

const initialState: AspisState = {
  accountType: "patient",
  fullName: "",
  phone: "",
  email: "",
  dob: "1990-06-15",
  gender: "Female",
  location: "Kampala, Uganda",
  conditions: [],
  height: "165",
  weight: "65",
  bloodGroup: "O+",
  smokes: "No",
  drinks: "No",
  connected: [],
  readings: [
    { id: "r1", type: "Blood Pressure", value: "120/80 mmHg", when: "Today, 8:00 AM" },
    { id: "r2", type: "Blood Sugar", value: "6.2 mmol/L", when: "Today, 7:30 AM" },
    { id: "r3", type: "Weight", value: "65 kg", when: "Today, 7:00 AM" },
    { id: "r4", type: "CD4 Count (HIV)", value: "450 cells/µl", when: "May 10, 2026" },
  ],
  reminders: {
    "Medication Reminders": true,
    "Appointment Reminders": true,
    "Health Check-ins": true,
    "Hydration Reminders": false,
    "Motivation & Tips": true,
  },
  reminderTime: "08:00",
  adherence: [],
  aiDone: false,
  doctorApproved: false,
  plan: "monthly",
  paymentMethod: "Mobile Money (MTN)",
  subscribed: false,
};

const KEY = "aspis-ai-state";

type Ctx = { state: AspisState; update: (patch: Partial<AspisState>) => void; reset: () => void };
const AspisContext = createContext<Ctx | null>(null);

export function AspisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AspisState>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      update: (patch) =>
        setState((s) => {
          const next = { ...s, ...patch };
          try {
            localStorage.setItem(KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
          return next;
        }),
      reset: () => {
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
        setState(initialState);
      },
    }),
    [state],
  );

  return <AspisContext.Provider value={value}>{children}</AspisContext.Provider>;
}

export function useAspis() {
  const ctx = useContext(AspisContext);
  if (!ctx) throw new Error("useAspis must be used inside AspisProvider");
  return ctx;
}
