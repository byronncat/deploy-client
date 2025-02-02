import { fireEvent, render } from '@testing-library/react';
import { Loader, Overlay } from '@global';

describe('components', () => {
  describe('loader', () => {
    it('should render the loader correctly', () => {
      const { container } = render(<Loader.BoxSpin />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('overlay', () => {
    it('should render the overlay correctly', () => {
      const exitHandler = jest.fn();

      const { container } = render(
        <Overlay onExit={exitHandler}>
          <div>Test</div>
        </Overlay>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should call the exitHandler when the overlay is clicked', () => {
      const exitHandler = jest.fn();

      const { container } = render(
        <Overlay onExit={exitHandler}>
          <div>Test</div>
        </Overlay>,
      );

      const overlay = container.querySelector('.overlay');
      if (overlay) fireEvent.click(overlay);
      const exitButton = container.querySelector('button');
      if (exitButton) fireEvent.click(exitButton);

      expect(exitHandler).toHaveBeenCalledTimes(2);
    });
  });
});
