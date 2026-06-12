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
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const getInitials = (user: User) => `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

export const UserTable = ({ users, onEdit, onDelete, onToggleActive }: UserTableProps) => {
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'superadmin':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><Shield className="w-3 h-3 mr-1" />Superadmin</Badge>;
      case 'admin':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Utilisateur</Badge>;
    }
  };

  return (
    <div className="rounded-md border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-800/50">
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="text-gray-300">Utilisateur</TableHead>
            <TableHead className="text-gray-300">Rôle</TableHead>
            <TableHead className="text-gray-300">Organisation</TableHead>
            <TableHead className="text-gray-300">Groupe</TableHead>
            <TableHead className="text-gray-300">Statut</TableHead>
            <TableHead className="text-gray-300">Dernière connexion</TableHead>
            <TableHead className="text-gray-300">Créé le</TableHead>
            <TableHead className="text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/30">
              <TableCell className="font-medium text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-500/15 text-blue-300 text-xs">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell className="text-gray-300">{user.organization?.name || '-'}</TableCell>
              <TableCell className="text-gray-300">{user.group?.name || '-'}</TableCell>
              <TableCell>
                {user.isActive ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Check className="w-3 h-3 mr-1" /> Actif
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                    <X className="w-3 h-3 mr-1" /> Inactif
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-300">
                {user.lastLogin ? format(new Date(user.lastLogin), 'dd MMM yyyy HH:mm', { locale: fr }) : '-'}
              </TableCell>
              <TableCell className="text-gray-300">
                {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem
                      onClick={() => onEdit(user)}
                      className="text-gray-300 hover:bg-gray-600 focus:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleActive(user.id)}
                      className="text-gray-300 hover:bg-gray-600 focus:text-white"
                    >
                      {user.isActive ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                      {user.isActive ? 'Désactiver' : 'Activer'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user.id)}
                      className="text-red-400 hover:bg-gray-600 hover:text-red-300 focus:text-red-300"
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
