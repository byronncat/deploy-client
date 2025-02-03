import { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { LoadingPage } from '@global';
import { authenticationApi } from '../api';
import { AuthContext, AuthenticationProvider } from '../providers';

function Authentication() {
  const [loading, setLoading] = useState(true);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    (async function authenticate() {
      setLoading(true);
      const response = await authenticationApi.authenticate();
      if (response.success) {
        login(response.data);
      };
      setLoading(false);
    })();
  }, [login]);

  if (loading) return <LoadingPage />;
  return <Outlet />;
}

export default function AuthenticateWrapper() {
  return (
    <AuthenticationProvider>
      <Authentication />
    </AuthenticationProvider>
  );
}
