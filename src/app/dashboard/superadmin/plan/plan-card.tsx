// components/plans/PlanCard.tsx
'use client';

import { Edit, Trash2, Users, CreditCard, Star, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plan } from '@/store/plan.store';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

export const PlanCard = ({ plan, onEdit, onDelete }: PlanCardProps) => {
  const getPlanColor = () => {
    switch (plan.name) {
      case 'starter':
        return 'border-blue-600';
      case 'business':
        return 'border-purple-600';
      case 'enterprise':
        return 'border-green-600';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const getPlanBadgeColor = () => {
    switch (plan.name) {
      case 'starter':
        return 'bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-600/30';
      case 'business':
        return 'bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-600/30';
      case 'enterprise':
        return 'bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600/30';
      default:
        return 'bg-gray-100 dark:bg-gray-600/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-600/30';
    }
  };

  return (
    <Card className={`bg-white dark:bg-gray-900 border ${getPlanColor()} hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden relative rounded-sm`}>
      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Populaire
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className={getPlanBadgeColor()}>
              {plan.label}
            </Badge>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
              {plan.name === 'starter' && 'Starter'}
              {plan.name === 'business' && 'Business'}
              {plan.name === 'enterprise' && 'Enterprise'}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Menu</span>
                <div className="w-4 h-4 text-gray-500 dark:text-gray-400">•••</div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DropdownMenuItem onClick={() => onEdit(plan)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(plan.id)} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Prix */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {plan.pricePerUser.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400">FCFA</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/utilisateur</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {plan.targetDescription}
        </p>

        {/* Détails employés */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <Users className="w-4 h-4" />
          <span>
            {plan.minEmployees} - {plan.maxEmployees === null ? '∞' : plan.maxEmployees} employés
          </span>
        </div>

        {/* Fonctionnalités */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Fonctionnalités incluses :</p>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};