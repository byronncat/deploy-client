import { createContext, useContext, useEffect, useState } from 'react';
import { postApi } from '../api';
import { usePath } from '@route';
import { AuthContext } from '@authentication';

import type { Comment, Post, PostDisplayData } from '../types';
import type { PropsWithChildren } from 'react';

export const PostContext = createContext(
  {} as {
    posts?: PostDisplayData[];
    currentPost?: PostDisplayData;
    setPosts: React.Dispatch<
      React.SetStateAction<PostDisplayData[] | undefined>
    >;
    getPostById: (postId: string) => PostDisplayData | null;
    selectCurrentPost: (postId: string) => void;
    updateCurrentPost: (data: Partial<PostDisplayData>) => void;
    removePost: (postId: string) => void;
    likeHandler: (id: string) => Promise<void>;
    addCommentHandler: (comment: Comment['content']) => Promise<void>;
    deleteCommentHandler: (commentId: Comment['id'], postId: Post['id']) => Promise<void>;
  },
);

export default function PostProvider({ children }: PropsWithChildren) {
  const [posts, setPosts] = useState<PostDisplayData[] | undefined>([]);
  const [post, setPost] = useState<PostDisplayData | undefined>();

  function selectCurrentPost(postId: string) {
    if (!posts) return;
    const currentPost = posts.find((post) => post.id === postId);
    if (currentPost) setPost(currentPost);
  }

  function getPostById(postId: string) {
    if (!posts) return null;
    return posts.find((post) => post.id === postId) || null;
  }

  function updateCurrentPost(data: Partial<PostDisplayData>) {
    setPost((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  }

  function removePost(postId: string) {
    setPosts((prev) => prev && prev.filter((post) => post.id !== postId));
  }

  const { user } = useContext(AuthContext);
  function isLiked(id: string) {
    if (!user) return false;
    if (posts) return posts.find((p) => p.id === id)?.likes.find((uid) => uid === user.id);
    if (post)  return post.likes.find((uid) => uid === user.id);
    return false;
  }

  async function likeHandler(id: string) {
    if (!user) return;
    const like = isLiked(id);
    const reponse = like
      ? await postApi.unlikePost(id)
      : await postApi.likePost(id);
    if (reponse.success) {
      setPost((prev) => {
        if (!prev) return prev;
        if (like)
          return { ...prev, likes: prev.likes.filter((id) => id !== user.id) };
        else return { ...prev, likes: [...prev.likes, user.id] };
      });
      setPosts((prev) => {
        if (!prev) return prev;
        return prev.map((p) => {
          if (p.id === id) {
            if (like) {
              return { ...p, likes: p.likes.filter((id) => id !== user.id) };
            } else {
              return { ...p, likes: [...p.likes, user.id] };
            }
          }
          return p;
        });
      });
    }
  }

  async function addCommentHandler(comment: Comment['content']) {
    if (!user || !post) return;
    const response = await postApi.commentPost(post.id, comment);
    if (response.success) {
      setPost((prev) => {
        if (!prev) return prev;
        return { ...prev, comments: prev.comments + 1 };
      });
    }
  }

  async function deleteCommentHandler(commentId: Comment['id'], postId: Post['id']) {
    if (!user || !post) return;
    const response = await postApi.deleteComment(postId, commentId);
    if (response.success) {
      setPost((prev) => {
        if (!prev) return prev;
        return { ...prev, comments: prev.comments - 1 };
      });
      setPosts((prev) => {
        if (!prev) return prev;
        return prev.map((p) => {
          if (p.id === postId) {
            return { ...p, comments: p.comments - 1 };
          }
          return p;
        });
      });
    }
  }

  const { currentPath } = usePath();
  useEffect(() => {
    setPost(undefined);
    setPosts(undefined);
  }, [currentPath]);

  return (
    <PostContext.Provider
      value={{
        posts,
        currentPost: post,
        setPosts,
        getPostById,
        removePost,
        selectCurrentPost,
        updateCurrentPost,
        likeHandler,
        addCommentHandler,
        deleteCommentHandler,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
