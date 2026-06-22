'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, BookOpen, Play, FileText, HelpCircle, Users, LayoutGrid, List, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFormationStore } from '@/store/formation.store';
import { Combobox } from '@/components/ui/combobox';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const Formations = () => {
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<{ id: string; title: string } | null>(null);
  
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

  const handleDeleteFormation = (formationId: string, formationTitle: string) => {
    setFormationToDelete({ id: formationId, title: formationTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!formationToDelete) return;

    const success = await deleteFormation(formationToDelete.id) as unknown as {success:boolean};
    
    setDeleteDialogOpen(false);
    setFormationToDelete(null);
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
      case 'VIDEO': return tCommon('admin.formations.type_video');
      case 'DOCUMENT': return tCommon('admin.formations.type_document');
      case 'INTERACTIVE': return tCommon('admin.formations.type_interactive');
      case 'QUIZ': return tCommon('admin.formations.type_quiz');
      case 'WEBINAR': return tCommon('admin.formations.type_webinar');
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return tCommon('admin.formations.status_published');
      case 'DRAFT': return tCommon('admin.formations.status_draft');
      case 'ARCHIVED': return tCommon('admin.formations.status_archived');
      default: return status;
    }
  };

  return (
 <div className="min-h-screen bg-gray-50 dark:bg-[#050816] -mt-2">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-[#0a0f1e]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              onClick={handleCreateFormation}
              className="bg-gray-200 hover:bg-gray-300 ml-2 dark:bg-slate-600 dark:hover:bg-slate-700 text-gray-900 dark:text-white cursor-pointer transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              {tCommon('admin.formations.list_new')}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.formations.total_formations')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.formations?.totalFormations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20">
                  <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.formations.list_published')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.formations?.publishedFormations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20">
                  <HelpCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.campaigns.draft')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.formations?.draftFormations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-sm hover:bg-gray-100 dark:hover:bg-[#1a1f36] cursor-pointer transition-colors duration-200 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c1023] p-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{tCommon('admin.formations.total_enrolled')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
            placeholder={tCommon('admin.formations.list_search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-gray-800/30 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 max-w-sm"
          />
          
          <Combobox
  options={[
    { value: 'all', label: tCommon('admin.users.all_status')},
    { value: 'PUBLISHED', label: tCommon('admin.formations.status_published') },
    { value: 'DRAFT', label: tCommon('admin.formations.status_draft') },
    { value: 'ARCHIVED', label: tCommon('admin.formations.status_archived') },
  ]}
  value={statusFilter}
  onChange={(value) => setStatusFilter(value || 'all')}
  placeholder={tCommon('admin.ambassadors.status_placeholder')}
  searchPlaceholder={tCommon('admin.campaigns.search_status')}
  className="bg-white dark:bg-gray-800/30 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-48"
/>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tCommon('admin.formations.formations_found', { count: filteredFormations?.length ?? 0 })}
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 bg-gray-200 dark:bg-gray-800/50" />
            ))}
          </div>
        ) : filteredFormations?.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{tCommon('admin.formations.list_empty')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {tCommon('admin.formations.list_empty_desc')}
              </p>
              <Button onClick={handleCreateFormation} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {tCommon('admin.formations.list_create')}
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
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden cursor-pointer group"
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
                        <DropdownMenuTrigger>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-auto">
                          <DropdownMenuItem onClick={() => handleViewFormation(formation.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            {tCommon('admin.organizations.view_details')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            {tCommon('admin.ambassadors.edit')}
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDeleteFormation(formation.id, formation.title)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {tCommon('admin.ambassadors.delete')}
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-gray-900 dark:text-white text-lg">{formation.title}</CardTitle>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{formation.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(formation.status)}>
                          {getStatusLabel(formation.status)}
                        </Badge>
                        {formation.isRequired && (
                          <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-400/50">
                            {tCommon('admin.formations.required')}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{tCommon('admin.formations.duration_min', { count: formation.estimatedDuration })}</span>
                        <span>{tCommon('admin.formations.min_score', { score: formation.passingScore })}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{tCommon('admin.formations.progression')}</span>
                          <span className="text-gray-900 dark:text-white">{completionRate(formation)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionRate(formation)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{tCommon('admin.formations.completed_count', { count: formation.completedCount })}</span>
                          <span>{tCommon('admin.formations.enrolled_count', { count: formation.enrolledCount })}</span>
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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {tCommon('admin.formations.list_table_view')}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.list_delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.formations.list_delete_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{formationToDelete?.title}"</span> {tCommon('admin.campaigns.page_delete_confirm_desc2')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              {tCommon('user.formations.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {tCommon('admin.ambassadors.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};