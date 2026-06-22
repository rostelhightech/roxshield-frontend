import { apiService } from "@/app/services/api.service";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export const useCheckAuth = () => {
  const { isAuthenticated, isLoading, clearAuth } = useAuthStore();
  

const checkAuth = async () => {
    if (!isLoading && isAuthenticated) {
       try {
              const response = await apiService.get('/auth/me');
              if (response.success) {
                useAuthStore.setState({ isAuthenticated: true });
              } else {
                clearAuth();
              }
            } catch (error) {
              clearAuth();
            } 
    }

   
}

useEffect(() => {

    checkAuth();

}, [isAuthenticated, isLoading]);

}
