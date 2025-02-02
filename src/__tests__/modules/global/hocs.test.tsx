import { Global } from '@global';
import { render } from '@testing-library/react';

describe('hoc', () => {
  describe('global', () => {
    it('should render the global hoc correctly', () => {
      const { container } = render(<Global>Test</Global>);
      expect(container).toMatchSnapshot();
    });
  });
});
