'use client';

import { motion } from 'framer-motion';
import { UserX, Mail, User, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CampaignTargetDetail } from '@/store/campaign.store';

interface CampaignNoInteractionTargetsProps {
  targetsWithoutInteraction: CampaignTargetDetail[];
}

export function CampaignNoInteractionTargets({ targetsWithoutInteraction }: CampaignNoInteractionTargetsProps) {
  if (targetsWithoutInteraction.length === 0) {
    return (
      <Card className="rounded-sm border border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-500/20 p-4">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Excellent engagement ! 🎉
          </h3>
          <p className="text-gray-600 dark:text-slate-300">
            Toutes les cibles ayant reçu l'email ont interagi avec la campagne.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <UserX className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Cibles sans interaction
            </CardTitle>
            <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
              {targetsWithoutInteraction.length} destinataire{targetsWithoutInteraction.length > 1 ? 's' : ''} n'a{targetsWithoutInteraction.length > 1 ? 'yant' : ''} pas encore ouvert l'email
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {targetsWithoutInteraction.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-500">sans réponse</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {targetsWithoutInteraction.map((target, index) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-4 hover:bg-gray-100 dark:hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {target.groupId ? (
                    <div className="rounded-full bg-purple-100 dark:bg-purple-500/20 p-2">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-blue-100 dark:bg-blue-500/20 p-2">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {target.firstName && target.lastName 
                        ? `${target.firstName} ${target.lastName}`
                        : target.email
                      }
                    </p>
                    {target.firstName && target.lastName && (
                      <p className="text-xs text-gray-500 dark:text-slate-400">{target.email}</p>
                    )}
                    {target.group && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        Groupe: {target.group.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400">
                    <UserX className="w-3 h-3" />
                    Aucune action
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700/50">
          <Button
            className="w-full bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Relancer ces cibles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}