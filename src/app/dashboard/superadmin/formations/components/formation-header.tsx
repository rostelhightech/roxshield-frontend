'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Archive, RotateCcw, XCircle, Edit, Download, Clock, Target, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useFormationStore, type Formation } from '@/store/formation.store';
import { toast } from 'sonner';

interface FormationHeaderProps {
  formation: Formation;
}

export function FormationHeader({ formation }: FormationHeaderProps) {
  const navigate = useNavigate();
  const { updateFormation, deleteFormation, isLoading } = useFormationStore();

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

  const handleArchive = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir archiver cette formation ?')) {
      try {
        await updateFormation(formation.id, { status: 'ARCHIVED' });
        toast.success('Formation archivée avec succès');
      } catch (error) {
        toast.error('Erreur lors de l\'archivage');
      }
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

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette formation ? Cette action est irréversible.')) {
      try {
        await deleteFormation(formation.id);
        toast.success('Formation supprimée avec succès');
        navigate({ to: '/dashboard/formations' });
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/dashboard/formations' })}
          className="text-slate-400 hover:text-gray-700"
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
                className="text-gray-700"
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
                className="text-gray-700"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Dépublier
              </Button>
              <Button 
                variant="outline"
                onClick={handleArchive}
                disabled={isLoading}
                className="text-gray-700"
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
                className="text-gray-700"
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
            className="text-gray-700"
            onClick={() => navigate({ to: '/dashboard/formations/formation-edit', search: { id: formation.id } })}
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" className="text-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Formation Header Card */}
      <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-sm text-2xl ${getTypeColor(formation.type)}`}>
                {getTypeIcon(formation.type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{formation.title}</h1>
                <p className="text-gray-400 text-lg">{formation.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(formation.status)}>
                {formation.status === 'PUBLISHED' ? 'Publié' : formation.status === 'DRAFT' ? 'Brouillon' : 'Archivé'}
              </Badge>
              {formation.isRequired && (
                <Badge variant="outline" className="text-red-400 border-red-400/50">
                  Obligatoire
                </Badge>
              )}
            </div>
          </div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
  <div className="flex items-center gap-2 text-gray-400">
    <Clock className="w-4 h-4" />
    <span>{formation.estimatedDuration} minutes</span>
  </div>
  <div className="flex items-center gap-2 text-gray-400">
    <Target className="w-4 h-4" />
    <span>Score min: {formation.passingScore}%</span>
  </div>
  <div className="flex items-center gap-2 text-gray-400">
    <Users className="w-4 h-4" />
    <span>{formation.stats?.totalUsers || 0} inscrits</span>
  </div>
  <div className="flex items-center gap-2 text-gray-400">
    <TrendingUp className="w-4 h-4" />
    <span>{formation.stats?.totalUsers && formation.stats.totalUsers > 0
      ? Math.round((formation.stats.completedUsers / formation.stats.totalUsers) * 100)
      : 0}% completé</span>
  </div>
</div>
        </CardContent>
      </Card>
    </>
  );
}