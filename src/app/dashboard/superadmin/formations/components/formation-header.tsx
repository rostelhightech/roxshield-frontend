'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Archive, RotateCcw, XCircle, Edit, Download, Clock, Target, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useFormationStore, type Formation } from '@/store/formation.store';
import { toast } from 'sonner';
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

interface FormationHeaderProps {
  formation: Formation;
}

export function FormationHeader({ formation }: FormationHeaderProps) {
  const navigate = useNavigate();
  const { updateFormation, deleteFormation, isLoading } = useFormationStore();
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return '🎥';
      case 'DOCUMENT': return '📄';
      case 'INTERACTIVE': return '🖱️';
      case 'QUIZ': return '❓';
      case 'WEBINAR': return '📺';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30';
      case 'DOCUMENT': return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30';
      case 'INTERACTIVE': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30';
      case 'QUIZ': return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30';
      case 'WEBINAR': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30';
      default: return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30';
      case 'DRAFT': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30';
      case 'ARCHIVED': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30';
      default: return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30';
    }
  };

  const handlePublish = async () => {
    try {
      await updateFormation(formation.id, { status: 'PUBLISHED' });
      toast.success('Formation publiée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la publication');
    }
  };

  const handleUnpublish = async () => {
    try {
      await updateFormation(formation.id, { status: 'DRAFT' });
      toast.success('Formation dépubliée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la dépublication');
    }
  };

  const handleArchive = () => {
    setArchiveDialogOpen(true);
  };

  const confirmArchive = async () => {
    try {
      await updateFormation(formation.id, { status: 'ARCHIVED' });
      toast.success('✅ Formation archivée avec succès');
      setArchiveDialogOpen(false);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'archivage');
    }
  };

  const handleRestore = async () => {
    try {
      await updateFormation(formation.id, { status: 'DRAFT' });
      toast.success('Formation restaurée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la restauration');
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFormation(formation.id);
      toast.success('✅ Formation supprimée avec succès');
      setDeleteDialogOpen(false);
      navigate({ to: '/dashboard/formations' });
    } catch (error) {
      toast.error('❌ Erreur lors de la suppression');
    }
  };

  return (
    <>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/dashboard/formations' })}
          className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux formations
        </Button>
        
        <div className="flex gap-3">
          {/* Boutons d'action selon le statut */}
          {formation.status === 'DRAFT' && (
            <>
              <Button 
                onClick={handlePublish} 
                disabled={isLoading}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isLoading ? 'Publication...' : 'Publier'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleArchive}
                disabled={isLoading}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archiver
              </Button>
            </>
          )}

          {formation.status === 'PUBLISHED' && (
            <>
              <Button 
                variant="outline"
                onClick={handleUnpublish}
                disabled={isLoading}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Dépublier
              </Button>
              <Button 
                variant="outline"
                onClick={handleArchive}
                disabled={isLoading}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archiver
              </Button>
            </>
          )}

          {formation.status === 'ARCHIVED' && (
            <>
              <Button 
                onClick={handleRestore} 
                disabled={isLoading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isLoading ? 'Restauration...' : 'Restaurer'}
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </>
          )}

          {/* Boutons communs */}
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/dashboard/formations/formation-edit', search: { id: formation.id } })}
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Formation Header Card */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-sm text-2xl ${getTypeColor(formation.type)}`}>
                {getTypeIcon(formation.type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{formation.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{formation.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(formation.status)}>
                {formation.status === 'PUBLISHED' ? 'Publié' : formation.status === 'DRAFT' ? 'Brouillon' : 'Archivé'}
              </Badge>
              {formation.isRequired && (
                <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-400/50">
                  Obligatoire
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formation.estimatedDuration} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Target className="w-4 h-4" />
              <span>Score min: {formation.passingScore}%</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{formation.stats?.totalUsers || 0} inscrits</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>{formation.stats?.totalUsers && formation.stats.totalUsers > 0
                ? Math.round((formation.stats.completedUsers / formation.stats.totalUsers) * 100)
                : 0}% completé</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Archiver la formation?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir archiver la formation <span className="font-semibold text-gray-900 dark:text-white">"{formation.title}"</span> ? Elle ne sera plus visible pour les utilisateurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmArchive}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Supprimer définitivement la formation?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer définitivement la formation <span className="font-semibold text-gray-900 dark:text-white">"{formation.title}"</span> ? Cette action est irréversible et toutes les données seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}