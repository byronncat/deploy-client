import axios from 'axios';
import { uri } from '@global';
import type { API } from '@global';
import type { SearchData, Profile, ProfileData, MediaInfo } from '../types';
import type { User } from '@global';

export async function searchProfile(
  username: string,
): Promise<API<SearchData[]>> {
  return await axios
    .get(uri.getHostingServer(`profile/search/${username}`), {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((error: any) => error.response.data);
}

export async function getProfile(
  username: User['username'],
): Promise<API<ProfileData | null>> {
  return await axios
    .get(uri.getHostingServer(`profile/${username}`), {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((error: any) => error.response.data);
}

export async function follow(uid: Profile['uid']) {
  return await axios
    .put(uri.getHostingServer('profile/follow'), { uid }, { withCredentials: true })
    .then((res) => res.data)
    .catch((error: any) => error.response.data);
}

export async function unfollow(uid: Profile['uid']) {
  return await axios
    .put(uri.getHostingServer('profile/unfollow'), { uid }, { withCredentials: true })
    .then((res) => res.data)
    .catch((error: any) => error.response.data);
}

export async function changeAvatar(avatar: MediaInfo) {
  return await axios
    .put(uri.getHostingServer('profile/avatar'), {
      file: JSON.stringify(avatar),
    }, { withCredentials: true })
    .then((res) => res.data)
    .catch((error: any) => error.response.data);
}

export async function removeAvatar() {
  return await axios
    .delete(uri.getHostingServer('profile/avatar'), { withCredentials: true })
    .then((res) => res.data)
    .catch((error: any) => error.response.data);
}
