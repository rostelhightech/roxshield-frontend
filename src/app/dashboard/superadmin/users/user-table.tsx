'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, Edit, MoreHorizontal, Shield, Trash2, UserCheck, UserX, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/store/user.store';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string, firstName: string, lastName: string) => void;
  onToggleActive: (id: string) => void;
}

const getInitials = (user: User) => `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

export const UserTable = ({ users, onEdit, onDelete, onToggleActive }: UserTableProps) => {
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'superadmin':
        return <Badge className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30"><Shield className="w-3 h-3 mr-1" />Superadmin</Badge>;
      case 'admin':
        return <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      default:
        return <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30">Utilisateur</Badge>;
    }
  };

  return (
    <div className="rounded-sm border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/30 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-100 dark:bg-gray-800/50">
          <TableRow className="border-gray-200 dark:border-gray-800 hover:bg-transparent">
            <TableHead className="text-gray-700 dark:text-gray-300">Utilisateur</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Rôle</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Organisation</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Groupe</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Statut</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Dernière connexion</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Créé le</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30">
              <TableCell className="font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{user.organization?.name || '-'}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{user.group?.name || '-'}</TableCell>
              <TableCell>
                {user.isActive ? (
                  <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30">
                    <Check className="w-3 h-3 mr-1" /> Actif
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30">
                    <X className="w-3 h-3 mr-1" /> Inactif
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {user.lastLogin ? format(new Date(user.lastLogin), 'dd MMM yyyy HH:mm', { locale: fr }) : '-'}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <DropdownMenuItem
                      onClick={() => onEdit(user)}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleActive(user.id)}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      {user.isActive ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                      {user.isActive ? 'Désactiver' : 'Activer'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user.id, user.firstName, user.lastName)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};