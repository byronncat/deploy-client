import type { MediaInfo } from '../../core/types/entity.d';

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  followers: User['id'][];
  followings: User['id'][];
  avatar?: MediaInfo;
  description?: string;
};
