import axios from 'axios';
import { uri } from '@global';

import type { AxiosResponse } from 'axios';
import type { API } from '@global';
import type { LoginFormData, RegisterFormData, UserToken } from '../types';

export async function login(data: LoginFormData): Promise<API<UserToken>> {
  return await axios
    .post(uri.getHostingServer('login'), data, { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data);
}

export async function register(data: RegisterFormData): Promise<API<UserToken>> {
  return await axios
    .post(uri.getHostingServer('register'), data, { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data);
}

export async function logout(): Promise<API> {
  return await axios
    .delete(uri.getHostingServer('logout'), { withCredentials: true})
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data);
}

export async function authenticate(): Promise<API<UserToken>> {
  return await axios
    .get(uri.getHostingServer('authenticate'), { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((error) => error.response.data || { success: false });
}
