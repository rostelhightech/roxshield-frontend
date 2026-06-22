'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Archive, RotateCcw, XCircle, Edit, Download, Clock, Target, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useFormationStore, type Formation } from '@/store/formation.store';
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
import { useTranslation } from 'react-i18next';


interface FormationHeaderProps {
  formation: Formation;
}

export function FormationHeader({ formation }: FormationHeaderProps) {
  const { t: tCommon } = useTranslation('common');
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
    } catch (error) {
      //
    }
  };

  const handleUnpublish = async () => {
    try {
      await updateFormation(formation.id, { status: 'DRAFT' });
    } catch (error) {
      //
    }
  };

  const handleArchive = () => {
    setArchiveDialogOpen(true);
  };

  const confirmArchive = async () => {
    try {
      await updateFormation(formation.id, { status: 'ARCHIVED' });
      setArchiveDialogOpen(false);
    } catch (error) {
      //
    }
  };

  const handleRestore = async () => {
    try {
      await updateFormation(formation.id, { status: 'DRAFT' });

    } catch (error) {
      //
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFormation(formation.id);
       setDeleteDialogOpen(false);
      navigate({ to: '/dashboard/formations' });
    } catch (error) {
      //
    }
  };

  return (
    <>
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/dashboard/formations' })}
          className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-700 self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCommon('user.formations.back_to_trainings')}
        </Button>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {/* Boutons d'action selon le statut */}
          {formation.status === 'DRAFT' && (
            <>
              <Button
                onClick={handlePublish}
                disabled={isLoading}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isLoading ? tCommon('admin.formations.header_publishing') : tCommon('admin.formations.header_publish')}
              </Button>
              <Button
                variant="outline"
                onClick={handleArchive}
                disabled={isLoading}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Archive className="w-4 h-4 mr-2" />
                {tCommon('admin.campaigns.archive')}
              </Button>
            </>
          )}

          {formation.status === 'PUBLISHED' && (
            <>
              <Button
                variant="outline"
                onClick={handleUnpublish}
                disabled={isLoading}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                {tCommon('admin.formations.header_unpublish')}
              </Button>
              <Button
                variant="outline"
                onClick={handleArchive}
                disabled={isLoading}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Archive className="w-4 h-4 mr-2" />
                {tCommon('admin.campaigns.archive')}
              </Button>
            </>
          )}

          {formation.status === 'ARCHIVED' && (
            <>
              <Button
                onClick={handleRestore}
                disabled={isLoading}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isLoading ? tCommon('admin.formations.header_restoring') : tCommon('admin.campaigns.restore')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {tCommon('admin.ambassadors.delete')}
              </Button>
            </>
          )}

          {/* Boutons communs */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => navigate({ to: '/dashboard/formations/formation-edit', search: { id: formation.id } })}
          >
            <Edit className="w-4 h-4 mr-2" />
            {tCommon('admin.ambassadors.edit')}
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            {tCommon('admin.formations.header_export')}
          </Button>
        </div>
      </div>

      {/* Formation Header Card */}
      <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className={`p-2 sm:p-3 rounded-sm text-xl sm:text-2xl shrink-0 ${getTypeColor(formation.type)}`}>
                {getTypeIcon(formation?.type)}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                  {formation.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg break-words">
                  {formation.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
              <Badge className={getStatusColor(formation.status)}>
                {formation.status === 'PUBLISHED' ? tCommon('admin.formations.status_published') : formation.status === 'DRAFT' ? tCommon('admin.formations.status_draft') : tCommon('admin.formations.status_archived')}
              </Badge>
              {formation.isRequired && (
                <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-400/50">
                  {tCommon('admin.formations.required')}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{tCommon('admin.formations.header_duration_minutes', { count: formation.estimatedDuration })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Target className="w-4 h-4 shrink-0" />
              <span>{tCommon('admin.formations.min_score', { score: formation.passingScore })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 shrink-0" />
              <span>{tCommon('admin.formations.enrolled_count', { count: formation.stats?.totalUsers || 0 })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>{tCommon('admin.formations.header_completed_pct', { count: formation.stats?.totalUsers && formation.stats.totalUsers > 0
                ? Math.round((formation.stats.completedUsers / formation.stats.totalUsers) * 100)
                : 0 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.header_archive_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.formations.header_archive_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{formation.title}"</span> {tCommon('admin.formations.header_archive_confirm_desc2')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='bg-white dark:bg-gray-900'>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white">
              {tCommon('user.formations.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmArchive}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {tCommon('admin.campaigns.archive')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">{tCommon('admin.formations.header_delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {tCommon('admin.formations.header_delete_confirm_desc')} <span className="font-semibold text-gray-900 dark:text-white">"{formation.title}"</span> {tCommon('admin.formations.header_delete_confirm_desc3')}
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
              {tCommon('admin.formations.header_delete_permanent')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}