import { ClassNameProvider, LoginPage, RegisterPage } from '@authentication';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => ({ setTitle: jest.fn() }),
}));

describe('page', () => {
  describe('log in', () => {
    it('should render correctly', () => {
      const { container } = render(
        <BrowserRouter>
          <ClassNameProvider>
            <LoginPage />
          </ClassNameProvider>
        </BrowserRouter>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('register', () => {
    it('should render correctly', () => {
      const { container } = render(
        <BrowserRouter>
          <ClassNameProvider>
            <RegisterPage />
          </ClassNameProvider>
        </BrowserRouter>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
