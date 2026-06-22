import SettingsPage from "@/components/setting";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

