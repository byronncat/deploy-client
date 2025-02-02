import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ErrorPage } from '@global';

describe('pages', () => {
  it('should render the 404 page correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  test('can navigate to home page', () => {
    window.history.pushState({}, '', '/bad/route');

    const router = createBrowserRouter([
      {
        path: '*',
        element: <ErrorPage />,
      },
      {
        errorElement: <ErrorPage />,
        children: [{ path: '/', element: <div>Homepage</div> }],
      },
    ]);

    const { getByText } = render(<RouterProvider router={router} />);

    const button = getByText(/back to home/i);
    fireEvent.click(button);
    expect(window.location.pathname).toBe('/');
  });
});
