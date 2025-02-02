import { useContext, useLayoutEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';

import { toast, useGlobalContext } from '@global';
import { Divider, Form, NavigationText } from '../components';
import { AuthContext, ClassNameContext } from '../providers';
import { authenticationApi } from '../api';
import { ROUTE } from '@route';
import { DEFAULT_VALUES, FIELD } from '../constants';

import type { OutletContextProps } from '../hocs';
import type { LoginFormData } from '../types';

export default function LoginPage() {
  const { loading } = useGlobalContext();
  const { className } = useContext(ClassNameContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { setTitle }: OutletContextProps = useOutletContext();
  useLayoutEffect(() => {
    setTitle('login');
  }, [setTitle]);

  const submitHandler: SubmitHandler<LoginFormData> = async (data) => {
    loading.start();
    toast.loading('Waiting for login');
    const response = await authenticationApi.login(data);
    loading.end();
    if (response.success) {
      login();
      navigate(ROUTE.HOME);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Form
      className={className.form}
      fieldList={FIELD.LOGIN}
      defaultValues={DEFAULT_VALUES.LOGIN_FORM}
      submitHandler={submitHandler}
      fieldClass={className}
      submitPlaceholder="Submit"
    >
      <Divider />
      <NavigationText
        text="Don't have an account?"
        navigateText="register"
        path="/register"
      />
    </Form>
  );
}
