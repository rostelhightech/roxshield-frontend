'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useFormationStore, type Formation, type FormationProgress } from '@/store/formation.store';
import { useUserStore } from '@/store/user.store';
import { useGroupStore } from '@/store/group.store';
import { toast } from 'sonner';

interface FormationAssignmentProps {
  formation: Formation;
  progress: FormationProgress[];
}

export function FormationAssignment({ formation, progress }: FormationAssignmentProps) {
  const [assignmentMode, setAssignmentMode] = useState<'all' | 'groups' | 'users'>('all');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAssignment, setLoadingAssignment] = useState(false);

  const { assignFormation, fetchFormationProgress } = useFormationStore();
  const { 
    filteredUsers: users, 
    isLoading: usersLoading, 
    fetchAll: fetchUsers, 
    setFilters: setUserFilters 
  } = useUserStore();
  const { 
    filteredGroups: groups, 
    isLoading: groupsLoading, 
    fetchAll: fetchGroups, 
    setFilters: setGroupFilters 
  } = useGroupStore();

  // ✅ Fonction pour formater le temps en secondes
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      return `${minutes}min ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Charger les users et groupes quand la formation est récupérée
  useEffect(() => {
    if (formation?.organizationId) {
      // Filtrer par organisation
      setUserFilters({ organizationId: formation.organizationId });
      setGroupFilters({ organizationId: formation.organizationId });
      
      // Charger les données
      fetchUsers();
      fetchGroups();
    }
  }, [formation?.organizationId, fetchUsers, fetchGroups, setUserFilters, setGroupFilters]);

  const handleAssignFormation = async () => {
    if (!formation) return;
    
    setLoadingAssignment(true);
    try {
      const assignment = {
        organizationId: formation.organizationId,
        allUsers: assignmentMode === 'all',
        groupIds: assignmentMode === 'groups' ? selectedGroups : [],
        userIds: assignmentMode === 'users' ? selectedUsers : [],
      };

      await assignFormation(formation.id, assignment);
      toast.success('Formation assignée avec succès');
      
      // Recharger la progression
      await fetchFormationProgress(formation.id);
    } catch (error) {
      toast.error('Erreur lors de l\'assignation');
    } finally {
      setLoadingAssignment(false);
    }
  };

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'FAILED': return '❌';
      case 'IN_PROGRESS': return '🔄';
      default: return '⏳';
    }
  };

  const getProgressStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 dark:text-green-400';
      case 'FAILED': return 'text-red-600 dark:text-red-400';
      case 'IN_PROGRESS': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-400 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Interface d'assignation */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Assigner cette formation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode d'assignation */}
          <div className="space-y-4">
            <Label className="text-gray-900 dark:text-white text-base font-medium">Qui peut faire cette formation ?</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="all-users"
                  name="assignment-mode"
                  checked={assignmentMode === 'all'}
                  onChange={() => setAssignmentMode('all')}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                />
                <Label htmlFor="all-users" className="text-gray-700 dark:text-white cursor-pointer">
                  Tous les utilisateurs de l'organisation
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="specific-groups"
                  name="assignment-mode"
                  checked={assignmentMode === 'groups'}
                  onChange={() => setAssignmentMode('groups')}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                />
                <Label htmlFor="specific-groups" className="text-gray-700 dark:text-white cursor-pointer">
                  Groupes spécifiques
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="specific-users"
                  name="assignment-mode"
                  checked={assignmentMode === 'users'}
                  onChange={() => setAssignmentMode('users')}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                />
                <Label htmlFor="specific-users" className="text-gray-700 dark:text-white cursor-pointer">
                  Utilisateurs spécifiques
                </Label>
              </div>
            </div>
          </div>

          {/* Sélection des groupes */}
          {assignmentMode === 'groups' && (
            <div className="space-y-4">
              <Label className="text-gray-900 dark:text-white font-medium">Sélectionner les groupes</Label>
              {groupsLoading ? (
                <p className="text-gray-500 dark:text-gray-400">Chargement des groupes...</p>
              ) : (
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {groups?.map((group) => (
                    <div key={group.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={() => handleGroupToggle(group.id)}
                      />
                      <Label htmlFor={`group-${group.id}`} className="text-gray-900 dark:text-white cursor-pointer flex-1">
                        {group.name}
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">({group.users?.length || 0} membres)</span>
                      </Label>
                    </div>
                  ))}
                  {groups.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun groupe disponible</p>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedGroups.length} groupe(s) sélectionné(s)
              </p>
            </div>
          )}

          {/* Sélection des utilisateurs */}
          {assignmentMode === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-900 dark:text-white font-medium">Sélectionner les utilisateurs</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white w-64"
                  />
                </div>
              </div>
              
              {usersLoading ? (
                <p className="text-gray-500 dark:text-gray-400">Chargement des utilisateurs...</p>
              ) : (
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`user-${user.id}`} className="text-gray-900 dark:text-white cursor-pointer">
                          {user.firstName} {user.lastName}
                        </Label>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                        {user.position && (
                          <p className="text-gray-400 dark:text-gray-500 text-xs">{user.position}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && !usersLoading && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun utilisateur trouvé</p>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </p>
            </div>
          )}

          {/* Bouton d'assignation */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleAssignFormation}
              disabled={loadingAssignment || (assignmentMode === 'groups' && selectedGroups.length === 0) || (assignmentMode === 'users' && selectedUsers.length === 0)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {loadingAssignment ? 'Assignation...' : 'Assigner la formation'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résumé des assignations actuelles */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Assignations actuelles</CardTitle>
        </CardHeader>
        <CardContent>
          {progress.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune assignation pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">
                  {progress.length} utilisateur(s) assigné(s)
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-400/50">
                    {progress.filter(p => p.status === 'COMPLETED').length} complétés
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-400/50">
                    {progress.filter(p => p.status === 'IN_PROGRESS').length} en cours
                  </Badge>
                  <Badge variant="outline" className="text-gray-500 dark:text-gray-400 border-gray-400/50">
                    {progress.filter(p => p.status === 'NOT_STARTED').length} non commencés
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {progress.slice(0, 5).map((userProgress) => (
                  <div key={userProgress.progressId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getProgressStatusIcon(userProgress.status)}</span>
                      <div>
                        <p className="text-gray-900 dark:text-white text-sm font-medium">
                          {userProgress.userFirstName} {userProgress.userLastName}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{userProgress.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${getProgressStatusColor(userProgress.status)}`}>
                        {userProgress.status === 'COMPLETED' ? 'Complété' : 
                         userProgress.status === 'IN_PROGRESS' ? 'En cours' :
                         userProgress.status === 'FAILED' ? 'Échoué' : 'Non commencé'}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs">
                        {userProgress.finalScore}% • {formatTime(userProgress.timeSpent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {progress.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Et {progress.length - 5} autre(s) utilisateur(s)
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}