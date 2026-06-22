'use client';

import { useMemo, useState } from 'react';
import { Check, Mail, Plus, Search, UserMinus, Users, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
 import { Group } from '@/store/group.store';
import { User, useUserStore } from '@/store/user.store';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from 'react-i18next';

interface GroupUsersPanelProps {
  group: Group;
  users: User[];
  onClose: () => void;
}

const getInitials = (user: User) => `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

export const GroupUsersPanel = ({ group, users, onClose }: GroupUsersPanelProps) => {
  const { t: tCommon } = useTranslation('common');
  const { updateUser, isLoading } = useUserStore();
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');

  const organizationUsers = useMemo(() => {
    return users.filter(user => user.organizationId === group.organizationId);
  }, [group.organizationId, users]);

  const positions = useMemo(() => {
    return Array.from(
      new Set(
        organizationUsers
          .map(user => user.position)
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [organizationUsers]);

  const filteredUsers = useMemo(() => {
    const searchLower = search.toLowerCase();
    return organizationUsers.filter(user => {
      const matchesSearch = !searchLower ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.position?.toLowerCase().includes(searchLower));

      const matchesPosition = !position || user.position === position;
      return matchesSearch && matchesPosition;
    });
  }, [organizationUsers, position, search]);

  const groupUsersCount = organizationUsers.filter(user => user.groupId === group.id).length;

  const handleAssign = async (user: User) => {
    await updateUser(user.id, {
      groupId: user.groupId === group.id ? null : group.id,
      organizationId: group.organizationId,
    });
  };

  return (
    <Card className="mb-6 overflow-hidden border border-blue-200 dark:border-blue-500/20 bg-white dark:bg-[#0c1023] shadow-sm dark:shadow-xl">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {group.organization?.name || tCommon('admin.grc.org_name')} · {tCommon('admin.groups.group_members_count', { count: groupUsersCount })}
                </p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X className="h-4 w-4 mr-2" />
            {tCommon('login.close')}
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tCommon('admin.formations.assignment_search_user')}
              className="pl-9 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
<Combobox
  options={[
    { value: '', label: tCommon('admin.groups.all_positions') },
    ...positions.map((position) => ({
      value: position,
      label: position,
    })),
  ]}
  value={position}
  onChange={setPosition}
  placeholder={tCommon('admin.groups.all_positions')}
  searchPlaceholder={tCommon('admin.groups.search_position')}
  className="bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
/>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto p-4">
        {filteredUsers.length === 0 ? (
          <div className="py-10 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600" />
            <p className="font-medium text-gray-900 dark:text-white">{tCommon('admin.formations.assignment_no_users')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('admin.groups.no_users_hint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filteredUsers.map((user) => {
              const isInGroup = user.groupId === group.id;
              const isInAnotherGroup = Boolean(user.groupId && user.groupId !== group.id);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge className="bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                          {user.position || tCommon('admin.groups.no_position')}
                        </Badge>
                        {isInAnotherGroup && (
                          <Badge className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500/30">
                            {user.group?.name || tCommon('admin.groups.other_group')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleAssign(user)}
                    className={isInGroup ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-500/30' : '  text-white'}
                  >
                    {isInGroup ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        {tCommon('admin.groups.remove_user')}
                      </>
                    ) : (
                      <>
                        {isInAnotherGroup ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {isInAnotherGroup ? tCommon('admin.groups.move_user') : tCommon('admin.groups.add_user')}
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};