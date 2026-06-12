'use client';

import { Edit, Mail, MoreVertical, Phone, Shield, Trash2, UserCheck, UserX, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/store/user.store';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const getInitials = (user: User) => `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

export const UserCard = ({ user, onEdit, onDelete, onToggleActive }: UserCardProps) => {
  const roleLabel = {
    user: 'Utilisateur',
    admin: 'Admin',
    superadmin: 'Superadmin',
  }[user.role];

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-blue-500/15 text-blue-300">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">{user.firstName} {user.lastName}</h3>
              <p className="text-xs text-gray-400 truncate">{user.organization?.name || 'Sans organisation'}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleActive(user.id)}>
                {user.isActive ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                {user.isActive ? 'Désactiver' : 'Activer'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Shield className="w-3 h-3 mr-1" />
            {roleLabel}
          </Badge>
          <Badge className={user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
            {user.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>{user.group?.name || 'Aucun groupe'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
