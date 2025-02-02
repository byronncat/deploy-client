import type { UseFormRegister } from 'react-hook-form';

export type FormFieldProps = {
  key?: string;
  type: string;
  placeholder: string;
  name: string;
  className?: {
    [key: string]: string;
  };
  register?: UseFormRegister;
  error?: any;
  validation?: {};
};
