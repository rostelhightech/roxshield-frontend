import { useEffect, useState } from "react";
import { OrganizationItem } from "./organizations-item";
import { apiService } from "@/app/services/api.service";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from 'react-i18next';

interface RecentOrganization {
  id: string;
  name: string;
  city: string;
  country: string;
  planName: string;
  currentEmployees: number;
  riskScore: number;
  createdAt: Date;
}

export function OrganizationsList() {
  const { t: tCommon } = useTranslation('common');
  const [organizations, setOrganizations] = useState<RecentOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleOrganizationClick = (organizationId: string) => {
    navigate({ 
      to: '/dashboard/organizations/$organizationId', 
      params: { organizationId } 
    });
  };

  useEffect(() => {
    const loadRecentOrganizations = async () => {
      try {
        const response = await apiService.get<{ success: boolean; data: RecentOrganization[] }>('/dashboard/recent-organizations?limit=5');
        if ('success' in response && response.success) {
          setOrganizations(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des organisations récentes', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentOrganizations();
  }, []);

  return (
    <div className="rounded-sm border border-gray-200 dark:border-white/5 bg-white  dark:bg-[#0c1023] px-2 py-2 md:p-6 shadow-xs dark:shadow-xl">
      <h2 className="mb-5 text-md font-semibold text-gray-900  dark:text-white">
        {tCommon('admin.page_overview.recent_orgs')}
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : organizations.length > 0 ? (
        organizations.map((org) => (
          <div 
            key={org.id} 
            onClick={() => handleOrganizationClick(org.id)}
            className="cursor-pointer"
          >
            <OrganizationItem
              name={org.name}
              city={`${org.city}${org.country ? `, ${org.country}` : ''}`}
              plan={org.planName}
              employeesCount={org.currentEmployees}
              riskScore={org.riskScore}
            />
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-400 dark:text-slate-400">
          {tCommon('admin.page_overview.no_orgs')}
        </div>
      )}
    </div>
  );
}