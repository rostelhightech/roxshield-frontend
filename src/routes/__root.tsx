// src/routes/__root.tsx
import { I18nProvider } from '@/lib/i18n';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';


interface MyRouterContext {
  auth: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div >
      <I18nProvider>
        <Toaster position="top-right" />

      <Outlet />
      </I18nProvider>
   
    </div>
  );
}
