import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { LandingLayout } from '@authentication';

describe('authentication layout', () => {
  it('should render correctly when not authenticated', () => {
    const { container } = render(<LandingLayout title="login" />);
    expect(container).toMatchSnapshot();
  });
});
