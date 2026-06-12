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
      <Card className="rounded-md border border-green-500/30 bg-green-900/20 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-500/20 p-4">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Excellent engagement ! 🎉
          </h3>
          <p className="text-slate-300">
            Toutes les cibles ayant reçu l'email ont interagi avec la campagne.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-md border border-white/10 bg-[#0c1023]/90 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <UserX className="w-5 h-5 text-orange-400" />
              Cibles sans interaction
            </CardTitle>
            <CardDescription className="mt-1">
              {targetsWithoutInteraction.length} destinataire{targetsWithoutInteraction.length > 1 ? 's' : ''} n'a{targetsWithoutInteraction.length > 1 ? 'yant' : ''} pas encore ouvert l'email
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-400">
              {targetsWithoutInteraction.length}
            </div>
            <p className="text-xs text-slate-500">sans réponse</p>
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
              className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {target.groupId ? (
                    <div className="rounded-full bg-purple-500/20 p-2">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-blue-500/20 p-2">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {target.firstName && target.lastName 
                        ? `${target.firstName} ${target.lastName}`
                        : target.email
                      }
                    </p>
                    {target.firstName && target.lastName && (
                      <p className="text-xs text-slate-400">{target.email}</p>
                    )}
                    {target.group && (
                      <p className="text-xs text-purple-400 mt-1">
                        Groupe: {target.group.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                    <UserX className="w-3 h-3" />
                    Aucune action
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Relancer ces cibles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
