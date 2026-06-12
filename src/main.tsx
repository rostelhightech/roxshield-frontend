// src/main.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { useAuthStore } from '@/store/auth.store';
import './globals.css';

// Création du routeur TanStack
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // Injecté dynamiquement dans InnerApp
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  // 1. Déclenche l'hydratation initiale au démarrage de l'app si nécessaire
  const hydrate = useAuthStore((state) => state.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 2. On écoute uniquement les propriétés d'authentification dont le routeur a besoin
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // 3. Injection dynamique de l'état Zustand dans le contexte du routeur
  return (
    <RouterProvider 
      router={router} 
      context={{ 
        auth: { isAuthenticated, isLoading } 
      }} 
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <InnerApp />
  
);
