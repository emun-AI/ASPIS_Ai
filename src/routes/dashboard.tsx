import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/aspis/kit";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
