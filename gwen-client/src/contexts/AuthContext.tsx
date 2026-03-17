import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeAuth, logout as logoutUser } from '../hooks/apis/AuthAPI';
import type { UserDTO } from 'gwen-generated-api';

interface AuthContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserDTO | null;
  logout: () => void;
  setUser: (user: UserDTO | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    // Initialiser le token depuis le localStorage
    initializeAuth();
    
    // Récupérer les données d'authentification du localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        // Ignorer les erreurs de parsing
      }
    }
    
    setIsInitialized(true);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const handleSetUser = (newUser: UserDTO | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        user,
        logout: handleLogout,
        setUser: handleSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

