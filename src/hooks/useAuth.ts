
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se existe sessão salva
    const authStatus = localStorage.getItem('hitech_auth');
    const savedUser = localStorage.getItem('hitech_user');
    
    if (authStatus === 'authenticated' && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  const login = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setUser('admin');
    }
  };

  const logout = () => {
    localStorage.removeItem('hitech_auth');
    localStorage.removeItem('hitech_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
}
