import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/user/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/user/formations" });
  },
});
