import {
  useClassNameContext,
  AuthenticationProvider,
  useAuthContext,
  ClassNameProvider,
} from '@authentication';
import { render, renderHook, waitFor } from '@testing-library/react';
import { ReactProps } from '@global';
import { authenticationApi } from '@/modules/authentication/api';
import { useEffect } from 'react';

jest.mock('@/modules/authentication/api');
describe('provider', () => {
  describe('className', () => {
    it('should return className object', async () => {
      const wrapper = ({ children }: ReactProps) => (
        <ClassNameProvider>{children}</ClassNameProvider>
      );
      const { result } = await renderHook(() => useClassNameContext(), {
        wrapper,
      });

      expect(result.current.className).toMatchSnapshot();
    });
  });

  // The issue might be related to the scope of the mock.
  describe('authentication', () => {
    beforeEach(() => {
      (authenticationApi.login as jest.Mock).mockResolvedValue({
        success: true,
        message: '',
      });
    });

    it('should return isAuthenticated object', async () => {
      let result: boolean = false;
      const Test = () => {
        const { isLoggedIn: isAuthenticated } = useAuthContext();

        useEffect(() => {
          result = isAuthenticated;
        }, [isAuthenticated]);
        return (
          <div data-testid="authentication">{isAuthenticated.toString()}</div>
        );
      };
      render(
        <AuthenticationProvider>
          <Test />
        </AuthenticationProvider>,
      );

      await waitFor(() => {
        expect(result).toBe(true);
      });
    });
  });
});
