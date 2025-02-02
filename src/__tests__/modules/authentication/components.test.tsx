import { BrowserRouter } from 'react-router-dom';
import { act, fireEvent, render } from '@testing-library/react';
import {
  Brand,
  Form,
  FIELD,
  DEFAULT_VALUES,
  Divider,
  NavigationText,
} from '@authentication';

describe('components', () => {
  it('should render brand component correctly', () => {
    const { container } = render(<Brand />);
    expect(container).toMatchSnapshot();
  });

  describe('form', () => {
    it('should render correctly', () => {
      const { container } = render(
        <Form
          fieldList={FIELD.LOGIN}
          defaultValues={DEFAULT_VALUES.LOGIN_FORM}
          submitHandler={() => console.log('submit')}
          submitPlaceholder="Login"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should call submitHandler when the form is submitted', async () => {
      const submitHandler = jest.fn();
      const { container } = render(
        <Form
          fieldList={FIELD.LOGIN}
          defaultValues={DEFAULT_VALUES.LOGIN_FORM}
          submitHandler={submitHandler}
          submitPlaceholder="Login"
        />,
      );
      await act(() => {
        const form = container.querySelector('form');
        if (form) fireEvent.submit(form);
      });
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });

  it('should render divider component correctly', () => {
    const { container } = render(<Divider />);
    expect(container).toMatchSnapshot();
  });

  it('should render navigation component correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <NavigationText
          navigateText="new user?"
          text="register"
          path="/register"
        />
      </BrowserRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
