import type { LoginFormData, RegisterFormData } from '../types';

const LOGIN_FORM = {
  identity: 'test@gmail.com',
  password: '1234567',
} as LoginFormData;

const REGISTER_FORM = {
  email: '',
  password: '',
  username: '',
} as RegisterFormData;

export const DEFAULT_VALUES = {
  LOGIN_FORM,
  REGISTER_FORM,
};
