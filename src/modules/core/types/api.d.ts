import type { Post, Profile, MediaInfo, Comment } from './entity';
import type { User } from '@global';

export type PostDisplayData = Omit<Post, 'comments'> &
  Pick<User, 'username' | 'avatar'> & { comments: number };

export type SearchData = Pick<User, 'id' | 'username' | 'avatar'>;
export type ProfileData = User & {
  totalPosts: number;
};

// TODO: Refactor

export type PostUploadData = {
  id?: Post['id'];
  content: Post['content'];
  files: MediaInfo[];
};

export type CommentDisplayData = Comment &
  Pick<User, 'username'> &
  Pick<Profile, 'avatar'>;
