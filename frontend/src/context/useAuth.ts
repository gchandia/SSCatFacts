import { createContext, useContext } from 'react';

export interface User {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context || !context.login) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
