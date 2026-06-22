import { useTranslation } from 'react-i18next';
// components/SplashScreenComponent.tsx


export const SplashScreenComponent = () => {
  const { t: tCommon } = useTranslation('common');
  

 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-[#0c1023] to-[#1a0b2e]">
        <div className="relative">
          <h1 className="text-5xl font-bold bg-linear-to-r from-[#5d2595] via-[#9b4dff] to-[#5d2595] bg-clip-text text-transparent animate-gradient">
            RoxShield
          </h1>
          <div className="absolute -bottom-3 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-[#5d2595] to-transparent animate-pulse" />
        </div>

        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-[#5d2595]/20 border-t-[#5d2595] animate-spin" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-b-[#8b3dff]/30 animate-pulse" />
        </div>

        <p className="text-gray-900 dark:text-white/50 animate-pulse text-sm">
          {tCommon('common.loading.loading')}
        </p>
      </div>
    );
  }

 

