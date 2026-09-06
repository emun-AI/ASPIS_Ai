import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASPIS Ai — Your AI Health Companion" },
      {
        name: "description",
        content:
          "AI health predictions, smart reminders and doctor-approved recommendations for UGX 10,000 per month.",
      },
      { property: "og:title", content: "ASPIS Ai — Your AI Health Companion" },
      {
        property: "og:description",
        content: "AI health predictions and doctor-approved recommendations for UGX 10,000 per month.",
      },
    ],
  }),
  component: Index,
});

// The app itself is plain HTML/CSS/JavaScript served from /app/.
function Index() {
  useEffect(() => {
    window.location.replace("/app/");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <a href="/app/" className="text-sm font-medium text-primary underline">
        Opening ASPIS Ai…
      </a>
    </div>
  );
}
