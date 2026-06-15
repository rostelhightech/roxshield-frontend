'use client';

import { useEffect } from 'react';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlanStore } from '@/store/plan.store';
import { useAuthStore } from '@/store/auth.store';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminPlans = () => {
  const { plans, isLoading, fetchAll } = usePlanStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Récupérer le plan actuel de l'organisation de l'admin
  const currentPlanId = user?.organization?.planId;
  const currentPlan = plans.find((p) => p.id === currentPlanId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <div className="mx-auto py-2 space-y-6">
        {/* Plan actuel */}
        {currentPlan && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              Votre plan actuel
            </h3>
            <Card className="rounded-sm border border-purple-500/30 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{currentPlan.label}</h4>
                      <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30">
                        Plan actif
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{currentPlan.targetDescription}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentPlan.pricePerUser.toLocaleString()} F
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">par utilisateur/mois</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    {currentPlan.minEmployees} - {currentPlan.maxEmployees || '∞'} employés
                  </span>
                </div>

                {currentPlan.features && currentPlan.features.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-purple-300 dark:border-purple-500/20">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Fonctionnalités incluses :</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Tous les plans disponibles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tous les plans disponibles
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-96 bg-gray-200 dark:bg-gray-800/50" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <Card className="rounded-sm bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50">
              <div className="p-12 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun plan disponible</h3>
                <p className="text-gray-500 dark:text-gray-400">Les plans seront bientôt disponibles</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === currentPlanId;
                return (
                  <Card
                    key={plan.id}
                    className={`
                      relative overflow-hidden transition-all duration-300 rounded-sm
                      ${
                        isCurrentPlan
                          ? 'bg-white dark:bg-[#0c1023]/90 border-purple-500/50 shadow-sm dark:shadow-xl'
                          : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600/50'
                      }
                    `}
                  >
                    {plan.isPopular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30">
                          Populaire
                        </Badge>
                      </div>
                    )}

                    <div className="p-6">
                      {/* En-tête */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{plan.label}</h4>
                          {isCurrentPlan && (
                            <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Votre plan
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{plan.targetDescription}</p>
                      </div>

                      {/* Prix */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {plan.pricePerUser.toLocaleString()}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">F</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">par utilisateur/mois</p>
                      </div>

                      {/* Capacité */}
                      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold text-gray-900 dark:text-white">Capacité :</span>{' '}
                          {plan.minEmployees} - {plan.maxEmployees || '∞'} employés
                        </p>
                      </div>

                      {/* Fonctionnalités */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Fonctionnalités incluses :
                          </p>
                          <div className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};