import axios from 'axios';
import { uri } from '@global';

import type { AxiosResponse } from 'axios';
import type { API } from '@global';
import type { LoginFormData, RegisterFormData } from '../types';

export async function login(data: LoginFormData): Promise<API> {
  return await axios
    .post(uri.getHostingServer('login'), data)
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data);
}

export async function register(data: RegisterFormData): Promise<API> {
  return await axios
    .post(uri.getHostingServer('register'), data)
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data);
}

export async function logout(): Promise<API> {
  return await axios
    .delete(uri.getHostingServer('logout'))
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data);
}

export async function authenticate(): Promise<API> {
  return await axios
    .get(uri.getHostingServer('authenticate'))
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data);
}
