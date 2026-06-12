'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, BookOpen, Play, FileText, HelpCircle, Users, LayoutGrid, List, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFormationStore } from '@/store/formation.store';
import { toast } from 'sonner';

export const Formations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  const navigate = useNavigate();
  
  const {
    formations,
    stats,
    isLoading,
    error,
    fetchAll,
    fetchFormationStats,
    deleteFormation,
  } = useFormationStore();

  // Chargement des données
  useEffect(() => {
    fetchAll();
    fetchFormationStats();
  }, []);

  // Filtrage des formations avec useMemo pour éviter les re-renders
  const filteredFormations = useMemo(() => {
    let filtered = formations;
    console.log(formations);
    
    if (searchTerm) {
      filtered = filtered.filter(formation =>
        formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type supprimé car le champ n'existe plus

    if (statusFilter !== 'all') {
      filtered = filtered.filter(formation => formation.status === statusFilter);
    }

    return filtered;
  }, [formations, searchTerm, statusFilter]);

  const handleCreateFormation = () => {
    navigate({ to: '/dashboard/formations/create' });
  };

  const handleViewFormation = (formationId: string) => {
    navigate({ 
      to: '/dashboard/formations/$formationId', 
      params: { formationId } 
    });
  };

  const handleDeleteFormation = async (formationId: string, formationTitle: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la formation "${formationTitle}" ?`)) {
      const success = await deleteFormation(formationId) as unknown as {success:boolean};
      if (success) {
        toast.success('Formation supprimée avec succès');
      } else {
        toast.error('Erreur lors de la suppression de la formation');
      }
    }
  };

  const completionRate = (formation: any) => {
    return formation.enrolledCount > 0 
      ? Math.round((formation.completedCount / formation.enrolledCount) * 100)
      : 0;
  };

  // Afficher les erreurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Play className="w-4 h-4" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4" />;
      case 'INTERACTIVE': return <Users className="w-4 h-4" />;
      case 'QUIZ': return <HelpCircle className="w-4 h-4" />;
      case 'WEBINAR': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'DOCUMENT': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'INTERACTIVE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'QUIZ': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'WEBINAR': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'DRAFT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ARCHIVED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'Vidéo';
      case 'DOCUMENT': return 'Document';
      case 'INTERACTIVE': return 'Interactif';
      case 'QUIZ': return 'Quiz';
      case 'WEBINAR': return 'Webinaire';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Publié';
      case 'DRAFT': return 'Brouillon';
      case 'ARCHIVED': return 'Archivé';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] -mt-2">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-[#0a0f1e]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              onClick={handleCreateFormation}
              className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle formation
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total formations</p>
                  <p className="text-2xl font-bold text-white">{stats?.formations?.totalFormations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Play className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Publiées</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.formations?.publishedFormations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <HelpCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Brouillons</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.formations?.draftFormations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-md hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-white/5 bg-[#0c1023] p-4 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Inscrits totaux</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.progress?.totalEnrollments || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Rechercher une formation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800/30 border-gray-700 text-white placeholder:text-gray-400 max-w-sm"
          />
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
            <SelectTrigger className="bg-gray-800/30 border-gray-700 text-white w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="PUBLISHED">Publié</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="ARCHIVED">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            {filteredFormations?.length} formation(s) trouvée(s)
          </p>
          <div className="flex items-center gap-2 bg-gray-800/30 rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className={viewMode === 'cards' ? 'bg-gray-700' : ''}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-gray-700' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 bg-gray-800/50" />
            ))}
          </div>
        ) : filteredFormations?.length === 0 ? (
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Aucune formation</h3>
              <p className="text-gray-400 mb-4">
                Commencez par créer votre première formation de sensibilisation
              </p>
              <Button onClick={handleCreateFormation} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Créer une formation
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFormations?.filter(f => f != null).map((formation, index) => (
              <motion.div
                key={formation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden cursor-pointer group"
                      onClick={() => handleViewFormation(formation.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getStatusColor(formation?.status || 'DRAFT')}`}>
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <Badge className={getStatusColor(formation?.status || 'DRAFT')}>
                          {getStatusLabel(formation?.status || 'DRAFT')}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger >
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem onClick={() => handleViewFormation(formation.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-400"
                            onClick={() => handleDeleteFormation(formation.id, formation.title)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-white text-lg">{formation.title}</CardTitle>
                    <p className="text-gray-400 text-sm">{formation.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(formation.status)}>
                          {getStatusLabel(formation.status)}
                        </Badge>
                        {formation.isRequired && (
                          <Badge variant="outline" className="text-red-400 border-red-400/50">
                            Obligatoire
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Durée: {formation.estimatedDuration} min</span>
                        <span>Score min: {formation.passingScore}%</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progression</span>
                          <span className="text-white">{completionRate(formation)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionRate(formation)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{formation.completedCount} complétés</span>
                          <span>{formation.enrolledCount} inscrits</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Table view (à implémenter si nécessaire)
          <div className="text-center py-8 text-gray-400">
            Vue tableau à implémenter
          </div>
        )}
      </div>
    </div>
  );
};