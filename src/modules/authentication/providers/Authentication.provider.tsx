import { useState, createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@route';

import type { PropsWithChildren } from 'react';
import type { UserToken } from '../types';

export const AuthContext = createContext(
  {} as {
    isLoggedIn: boolean;
    login: (user: UserToken) => void;
    logout: () => void;
    user: UserToken | null;
    setUser: (user: UserToken) => void;
  },
);

export default function Authentication({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserToken | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback((user: UserToken) => {
    setIsLoggedIn(true);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    navigate(ROUTE.LOGIN);
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
