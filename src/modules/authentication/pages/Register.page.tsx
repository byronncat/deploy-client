import { useContext, useLayoutEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import clsx from 'clsx';

import { toast, useGlobalContext } from '@global';
import { Divider, Form, NavigationText } from '../components';
import { AuthContext, ClassNameContext } from '../providers';
import { authenticationApi } from '../api';
import { ROUTE } from '@route';
import { DEFAULT_VALUES, FIELD } from '../constants';

import type { OutletContextProps } from '../hocs';
import type { RegisterFormData } from '../types';

const Register = () => {
  const { loading } = useGlobalContext();
  const { className } = useContext(ClassNameContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { setTitle }: OutletContextProps = useOutletContext();
  useLayoutEffect(() => {
    setTitle('register');
  }, [setTitle]);

  const submitHandler: SubmitHandler<RegisterFormData> = async (data) => {
    loading.start();
    toast.loading('Waiting for registration');
    const response = await authenticationApi.register(data);
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
    <div className={clsx(className.form, 'md:w-200')}>
      <div className="flex gap-x-10">
        <Form
          className="w-full md:w-1/2"
          fieldList={FIELD.REGISTER}
          defaultValues={DEFAULT_VALUES.REGISTER_FORM}
          submitHandler={submitHandler}
          fieldClass={className}
          submitPlaceholder="Register"
        />
        <div className={clsx('flex flex-col', 'hidden md:block w-1/2')}>
          {Object.entries(FIELD.REQUIREMENTS).map(([field, requirements]) => (
            <div key={field} className={clsx('mb-4')}>
              <h3
                className={clsx(
                  'mb-2',
                  'font-semibold capitalize',
                  'text-on-surface/[0.87] dark:text-dark-on-surface/[0.87]',
                )}
              >
                {field}:
              </h3>
              <ul
                className={clsx(
                  'space-y-1 list-disc list-inside',
                  'text-on-surface/[0.87] dark:text-dark-on-surface/[0.8]',
                )}
              >
                {requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <NavigationText
        navigateText="login"
        text="Already have an account?"
        path="/login"
      />
    </div>
  );
};

export default Register;
