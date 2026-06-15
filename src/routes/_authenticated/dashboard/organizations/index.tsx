import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { Organizations } from "@/app/dashboard/superadmin/organizations/organizations";
import { useAuthStore } from "@/store/auth.store";
import { roleEnum } from "@/constants/roleEnum";
import { useNavigate } from "@tanstack/react-router";
import { useOrganizationStore } from "@/store/organization.store";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/_authenticated/dashboard/organizations/"
)({
  component: OrganizationsPage,
});

function OrganizationsPage() {
  const {user} = useAuthStore()
  const {organizations} = useOrganizationStore()
  const navigate = useNavigate();
  const isNotSuperAdmin = user?.role !== roleEnum.SUPERADMIN
  
    const handleViewDetails = (organizationId: string) => {
      navigate({ 
        to: '/dashboard/organizations/$organizationId', 
        params: { organizationId } 
      });
    };

useEffect(()=>{
  if (isNotSuperAdmin && organizations){
    handleViewDetails(organizations[0].id)
  }
},[user, organizations])
  
  return (
    <>
      <DashboardTopbar
        title="Organisations"
        description={user?.role === roleEnum.SUPERADMIN ? "Gérez toutes les organisations et leurs abonnements":"Gérez votre organisation"}
      />
      <Organizations />
    </>
  );
}