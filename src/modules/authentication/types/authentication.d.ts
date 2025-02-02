import type { User } from '@global';

export type LoginFormData = {
  identity: User['username'] | User['email'];
  password: User['password'];
};

export type RegisterFormData = {
  email: User['email'];
  username: User['username'];
  password: User['password'];
};
