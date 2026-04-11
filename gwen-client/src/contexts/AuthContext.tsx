import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { type DTOUser, useGetCurrentUser } from 'gwen-generated-api';
import { initializeAuth, logout as logoutUser } from '../hooks/apis/AuthAPI';

interface AuthContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: DTOUser | null;
  logout: () => void;
  setUser: (user: DTOUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<DTOUser | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const {
    data: currentUser,
    isLoading,
    isError,
  } = useGetCurrentUser({
    query: {
      enabled: true,
      retry: false,
    },
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (currentUser) {
      setUser(currentUser as DTOUser);
      setIsAuthenticated(true);
    } else if (isError) {
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsInitialized(true);
  }, [currentUser, isLoading, isError]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleSetUser = (newUser: DTOUser | null) => {
    setUser(newUser);
    if (newUser) {
      setIsAuthenticated(true);
    } else {
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
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
