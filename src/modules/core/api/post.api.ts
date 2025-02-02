import axios from 'axios';
import { uri } from '@global';
import type { API } from '@global';
import type {
  Comment,
  CommentDisplayData,
  PostDisplayData,
  PostUploadData,
} from '../types';
import type { AxiosResponse } from 'axios';

enum PostsType {
  Home = 'home',
  Explore = 'explore',
}

export async function getHomePosts(
  page: number,
): Promise<API<PostDisplayData[] | null>> {
  return await axios
    .get(uri.getHostingServer('post'), {
      params: { page, type: PostsType.Home },
      withCredentials: true,
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => err.response.data);
}

export async function explorePosts(
  page: number,
): Promise<API<PostDisplayData[] | null>> {
  return await axios
    .get(uri.getHostingServer(`post`), {
      params: { page, type: PostsType.Explore },
      withCredentials: true,
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}

export async function uploadPost(
  postData: PostUploadData,
  method: 'post' | 'put',
): Promise<API> {
  return await axios[method](uri.getHostingServer('post'), postData, {
    withCredentials: true,
  })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => err.response.data);
}

// TODO: Refactor

export async function likePost(postId: PostDisplayData['id']): Promise<API> {
  return await axios
    .post(uri.getHostingServer('post/like'), { postId }, { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}

export async function unlikePost(postId: PostDisplayData['id']): Promise<API> {
  return await axios
    .post(uri.getHostingServer('post/unlike'), { postId }, { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}

export async function commentPost(
  postId: PostDisplayData['id'],
  content: Comment['content'],
): Promise<API> {
  return await axios
    .post(uri.getHostingServer('post/comment'), { postId, content }, { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}

export async function getComments(
  postId: PostDisplayData['id'],
): Promise<API<CommentDisplayData[]>> {
  return await axios
    .get(uri.getHostingServer(`post/comment/${postId}`), { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}

export async function getPostsByUsername(
  username: string,
  page: number,
): Promise<API<PostDisplayData[]>> {
  return await axios
    .get(uri.getHostingServer(`post/user/${username}`), { params: { page }, withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}

export async function deletePost(postId: PostDisplayData['id']): Promise<API> {
  return await axios
    .delete(uri.getHostingServer(`post/${postId}`), { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}

export async function deleteComment(
  postId: PostDisplayData['id'],
  commentId: Comment['id'],
): Promise<API> {
  return await axios
    .delete(uri.getHostingServer(`post/${postId}/comments/${commentId}`), { withCredentials: true })
    .then((res: AxiosResponse) => res.data)
    .catch((err: any) => err.response.data);
}