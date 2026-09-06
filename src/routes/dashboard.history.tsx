import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel } from "@/components/aspis/kit";
import { useAspis } from "@/lib/aspis-store";

export const Route = createFileRoute("/dashboard/history")({
  head: () => ({
    meta: [
      { title: "History & trends — ASPIS Ai" },
      { name: "description", content: "See how your blood pressure and other readings change over time." },
      { property: "og:title", content: "History & trends — ASPIS Ai" },
      { property: "og:description", content: "Track your health readings over 7 days to a year." },
    ],
  }),
  component: History,
});

const SERIES: Record<string, number[]> = {
  "7D": [118, 124, 121, 130, 119, 126, 120],
  "30D": [122, 128, 119, 133, 125, 118, 129, 121, 124, 120],
  "90D": [130, 127, 124, 126, 122, 121, 119, 123, 120, 118, 122, 120],
  "1Y": [136, 133, 130, 128, 127, 125, 124, 123, 122, 121, 120, 120],
};

function History() {
  const { state } = useAspis();
  const [range, setRange] = useState("7D");
  const data = SERIES[range];
  const min = Math.min(...data) - 6;
  const max = Math.max(...data) + 6;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / (max - min)) * 100}`)
    .join(" ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Trends</h1>
        <p className="text-sm text-muted-foreground">Track your health over time</p>
      </div>

      <Panel>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Blood Pressure</h2>
          <div className="flex gap-1">
            {Object.keys(SERIES).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  range === r ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-5 h-44 w-full">
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="mt-3 text-right text-xs text-muted-foreground">
          Latest <span className="font-semibold text-foreground">120/80</span>
        </p>
      </Panel>

      <Panel>
        <h2 className="text-sm font-semibold">All history</h2>
        <div className="mt-3 divide-y divide-border">
          {state.readings.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2.5 text-sm">
              <span>{r.type}</span>
              <span className="text-muted-foreground">{r.value}</span>
              <span className="text-xs text-muted-foreground">{r.when}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
