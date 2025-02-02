import { createContext, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useToggle } from 'usehooks-ts';

import { PROTECTED_ROUTE, usePath } from '@route';
import { LoadingPage } from '@global';
import { AuthContext } from '@authentication';
import {
  PostProvider,
  SidebarProvider,
  CloudinaryProvider,
} from '../providers';
import { ColumnLayout } from '../layouts';

export const LoadContext = createContext({
  isLoaded: true,
  toggleLoaded: () => {},
});

export default function Dashboard() {
  const { isLoggedIn } = useContext(AuthContext);
  const { currentPath } = usePath();
  const [isLoaded, toggleLoaded] = useToggle(true);

  if (!isLoaded) return <LoadingPage />;
  if (!isLoggedIn && currentPath === PROTECTED_ROUTE.HOME)
    return <Navigate to="/login" />;
  return (
    <LoadContext.Provider
      value={{
        isLoaded,
        toggleLoaded,
      }}
    >
      <PostProvider>
        <CloudinaryProvider>
          <SidebarProvider>
            <ColumnLayout>
              <Outlet />
            </ColumnLayout>
          </SidebarProvider>
        </CloudinaryProvider>
      </PostProvider>
    </LoadContext.Provider>
  );
}
