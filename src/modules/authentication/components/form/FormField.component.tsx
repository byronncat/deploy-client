import { useState } from 'react';
import clsx from 'clsx';
import { EyeIcon } from '@assets/icons';
import type { FormFieldProps } from '../../types';

export default function FormField({
  type,
  placeholder,
  name,
  register,
  error,
  validation,
  className,
}: FormFieldProps) {
  const [inputType, setInputType] = useState(type);
  function togglePasswordVisibilityHandler() {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  }
  return (
    <>
      <div className={className?.formField}>
        <input
          type={inputType}
          className={clsx(
            className?.formInput,
            error?.message && 'border-error dark:border-dark-error',
          )}
          id={name}
          placeholder={' '}
          {...register!(name, { ...validation })}
        />
        <label
          className={clsx(
            className?.formLabel,
            error?.message && 'border-error dark:border-dark-error',
          )}
          htmlFor={name}
        >
          {placeholder}
        </label>
        {type === 'password' && (
          <span
            className={clsx(
              'flex justify-center items-center',
              'absolute top-0 right-0',
              'h-full w-12',
              'text-xl',
              'cursor-pointer',
              'opacity-60 hover:opacity-100 transition-opacity duration-300',
            )}
            onClick={togglePasswordVisibilityHandler}
          >
            <EyeIcon
              className={clsx(
                'size-5',
                'fill-on-background/[0.8] dark:fill-dark-on-background',
              )}
              slash={inputType === 'password'}
            />
          </span>
        )}
      </div>
      {error && (
        <p
          className={clsx(
            className?.formErrorMessage,
            error?.message && className?.formErrorMessageAnimation,
          )}
        >
          {error?.message}
        </p>
      )}
    </>
  );
}
