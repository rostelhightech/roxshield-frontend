import { createFileRoute } from "@tanstack/react-router";
import { DashboardTopbar } from "@/components/layout/topbar";
import { useTranslation } from 'react-i18next';
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[user, organizations])

const {t} = useTranslation();
  
  return (
    <>
      <DashboardTopbar
        title={t("nav.topbar.organizations_title")}
        description={user?.role === roleEnum.SUPERADMIN ? t("nav.topbar.organizations_desc_superadmin"):t("nav.topbar.organizations_desc_admin")}
      />
      <Organizations />
    </>
  );
}