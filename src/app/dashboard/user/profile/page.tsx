'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DashboardTopbar } from '@/components/layout/topbar';
import { useAuthStore } from '@/store/auth.store';
import { Mail, Building2, Briefcase, Calendar, Shield } from 'lucide-react';
import { ChangePasswordDialog } from '@/components/change-password-dialog';

export default function UserProfilePage() {
  const { user } = useAuthStore();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardTopbar title="Mon Profil" description="Gérez vos informations personnelles" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#050816] px-6 pb-12">
        <div className="mx-auto space-y-6">
          {/* Informations personnelles */}
          <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 dark:text-white">Prénom</Label>
                  <Input
                    id="firstName"
                    value={user.firstName}
                    disabled
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 dark:text-white">Nom</Label>
                  <Input
                    id="lastName"
                    value={user.lastName}
                    disabled
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                />
              </div>

              {user.position && (
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-gray-700 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Poste
                  </Label>
                  <Input
                    id="position"
                    value={user.position}
                    disabled
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {user.department && (
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Département
                  </Label>
                  <Input
                    id="department"
                    value={user.department}
                    disabled
                    className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations du compte */}
          <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Rôle</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Votre niveau d'accès</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
                  {user.role === 'superadmin' ? 'Super Administrateur' : 
                   user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Membre depuis</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Date de création du compte</p>
                  </div>
                </div>
                <span className="text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1023]/90 shadow-sm dark:shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Changer mon mot de passe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordDialog 
        open={isChangePasswordOpen} 
        onOpenChange={setIsChangePasswordOpen} 
      />
    </>
  );
}