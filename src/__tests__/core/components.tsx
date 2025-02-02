import { Sidebar } from '@core';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('component', () => {
  describe('sidebar', () => {
    it('should render correctly', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
