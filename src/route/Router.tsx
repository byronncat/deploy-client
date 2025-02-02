import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Landing,
  LoginPage,
  RegisterPage,
  Authentication,
} from '@authentication';
import { Dashboard, HomePage, ExplorePage, ProfilePage } from '@core';
import { ErrorPage } from '@global';
import { ROUTE } from '@route';

export default function Router() {
  const router = createBrowserRouter([
    {
      path: '*',
      element: <ErrorPage statusCode={404} />,
    },
    {
      element: <Authentication />,
      errorElement: <ErrorPage statusCode={400} />,
      children: [
        {
          element: <Dashboard />,
          errorElement: <ErrorPage />,
          children: [
            { path: ROUTE.HOME, element: <HomePage /> },
            { path: ROUTE.EXPLORE, element: <ExplorePage /> },
            { path: ROUTE.PROFILE, element: <ProfilePage /> },
          ],
        },
        {
          element: <Landing />,
          errorElement: <ErrorPage />,
          children: [
            { path: ROUTE.LOGIN, element: <LoginPage /> },
            { path: ROUTE.REGISTER, element: <RegisterPage /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
