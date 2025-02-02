import { useForm, SubmitHandler } from 'react-hook-form';
import clsx from 'clsx';
import { useGlobalContext } from '@global';
import FormField from './FormField.component';

import type { PropsWithChildren } from 'react';
import type { FormFieldProps } from '../../types';

type FormProps = PropsWithChildren<{
  fieldList: FormFieldProps[];
  defaultValues: any;
  submitHandler: SubmitHandler<any>;
  fieldClass?: Record<string, string>;
  submitPlaceholder?: string;
  className?: string;
}>;

export default function Form({
  children,
  className,
  fieldList,
  defaultValues,
  submitHandler,
  fieldClass,
  submitPlaceholder,
}: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });
  const { loading } = useGlobalContext();

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={className}>
      {fieldList.map((field) => {
        return (
          <FormField
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            className={fieldClass}
            register={register}
            validation={field.validation}
            error={errors[field.name]}
          />
        );
      })}
      <input
        type="submit"
        value={submitPlaceholder}
        className={clsx('simple-border-button', 'w-full mt-5 py-2')}
        disabled={loading.state}
      />
      {children}
    </form>
  );
}
