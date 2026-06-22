import { useTranslation } from 'react-i18next';
// components/LoadingComponent.tsx
export const LoadingComponent = () => {
  const { t: tCommon } = useTranslation('common');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-[#0c1023] to-[#1a0b2e]">
      {/* RoxShield Animé */}
    
      {/* Spinner simple */}
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-[#5d2595]/20 border-t-[#5d2595] animate-spin" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-b-[#8b3dff]/30 animate-pulse" />
      </div>

      {/* Texte de chargement */}
      <p className="text-gray-900 dark:text-white/50 animate-pulse text-sm">
        {tCommon('common.loading.loading')}
      </p>
    </div>
  );
};