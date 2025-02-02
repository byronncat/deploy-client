import { useState, createContext, useCallback, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJwt } from 'react-jwt';
import Cookies from 'js-cookie';
import { ROUTE } from '@route';

import type { PropsWithChildren } from 'react';
import type { User } from '@global';

export const AuthContext = createContext(
  {} as {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    user: UserToken | null;
  },
);

interface UserToken extends Omit<User, 'password'> {
  iat: number;
}

export default function Authentication({ children }: PropsWithChildren) {
  const userCookie = Cookies.get('user');
  const navigate = useNavigate();
  const { decodedToken } = useJwt<UserToken>(userCookie || '');
  const [user, setUser] = useState<UserToken | null>(decodedToken);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    navigate(ROUTE.LOGIN);
  }, [navigate]);

  useLayoutEffect(() => {
    if (decodedToken) {
      setUser(decodedToken);
    }
  }, [decodedToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
