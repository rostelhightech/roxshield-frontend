'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/store/user.store';
import { Organization } from '@/store/organization.store';
import { Group } from '@/store/group.store';
import { useAuthStore } from '@/store/auth.store';
import { roleEnum } from '@/constants/roleEnum';
import { useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

interface UserFiltersProps {
  organizations: Organization[];
  groups: Group[];
}

export const UserFilters = ({ organizations, groups }: UserFiltersProps) => {
  const { t: tCommon } = useTranslation('common');
  const { filters, setFilters } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const isNotSuperAdmin = currentUser?.role !== roleEnum.SUPERADMIN;

  // Forcer l'organisation de l'utilisateur si non superadmin
  useEffect(() => {
    if (isNotSuperAdmin && currentUser?.organizationId && filters.organizationId !== currentUser.organizationId) {
      setFilters({ organizationId: currentUser.organizationId, groupId: '' });
    }
  }, [isNotSuperAdmin, currentUser, filters.organizationId, setFilters]);

  // Les groupes disponibles : si une organisation est sélectionnée (via filtre ou forcée)
  const effectiveOrgId = filters.organizationId;
  const availableGroups = effectiveOrgId
    ? groups.filter(group => group.organizationId === effectiveOrgId)
    : groups;

  const selectedOrganization = organizations.find(org => org.id === effectiveOrgId);
  const selectedGroup = availableGroups.find(group => group.id === filters.groupId);

  // Options des rôles (sans superadmin si non superadmin)
  const roleOptions = isNotSuperAdmin
    ? [
        { value: '', label: tCommon('admin.users.all_roles')} ,
        { value: 'user', label: tCommon('admin.grc.user_name')} ,
        { value: 'admin', label: 'Admin' },
      ]
    : [
        { value: '', label: tCommon('admin.users.all_roles')} ,
        { value: 'user', label: tCommon('admin.grc.user_name') },
        { value: 'admin', label: 'Admin' },
        { value: 'superadmin', label: 'Superadmin' },
      ];

  return (
    <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={tCommon('admin.users.search_placeholder')}
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white outline-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              type="button"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-white" />
            </button>
          )}
        </div>

      {/* Filtre rôle */}
<Combobox
  options={roleOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }))}
  value={filters.role || ''}
  onChange={(value) => setFilters({ role: value || undefined })}
  placeholder={tCommon('admin.users.all_roles')}
  searchPlaceholder="Rechercher un rôle..."
  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
/>

{/* Filtre organisation : masqué si non superadmin */}
{!isNotSuperAdmin && (
  <Combobox
    options={[
      { value: '', label: tCommon('admin.groups.all_orgs')},
      ...organizations.map((org) => ({
        value: org.id,
        label: org.name,
      })),
    ]}
    value={filters.organizationId || ''}
    onChange={(value) => setFilters({ organizationId: value, groupId: '' })}
    placeholder={tCommon('admin.groups.all_orgs')}
    searchPlaceholder="Rechercher une organisation..."
    className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
  />
)}

{/* Filtre groupe */}
<Combobox
  options={[
    { value: '', label: tCommon('admin.users.all_groups')} ,
    ...availableGroups.map((group) => ({
      value: group.id,
      label: group.name,
    })),
  ]}
  value={filters.groupId || ''}
  onChange={(value) => setFilters({ groupId: value || undefined })}
  placeholder={tCommon('admin.users.all_groups')}
  searchPlaceholder="Rechercher un groupe..."
  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
/>

{/* Filtre statut */}
<Combobox
  options={[
    { value: '', label: tCommon('admin.users.all_status') },
    { value: 'active', label: tCommon('common.active') },
    { value: 'inactive', label: tCommon('common.inactive') },
  ]}
  value={filters.status || ''}
  onChange={(value) => setFilters({ status: value || undefined })}
  placeholder={tCommon('admin.users.all_status')}
  searchPlaceholder="Rechercher un statut..."
  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
/>
      </div>
    </Card>
  );
};