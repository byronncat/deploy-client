import type { MediaInfo } from '../../core/types/entity.d';

export type User = {
  id: string;
  _id: string;
  username: string;
  email: string;
  password: string;
  followers: User['id'][];
  followings: User['id'][];
  avatar?: MediaInfo;
  description?: string;
};
