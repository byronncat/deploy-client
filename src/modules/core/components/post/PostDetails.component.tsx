import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { toast, Overlay } from '@global';
import { AuthContext } from '@authentication';
import { postApi } from '../../api';
import { FilesProvider, PostContext } from '../../providers';
import { useFormat } from '../../hooks';

import { UploadWindow } from './upload';
import Carousel from './Carousel.component';
import Avatar from '../Avatar.component';
import Divider from '../Divider.component';
import Menu from '../Menu.component';

import { AUTHOR_POST_MENU } from '../../constants';
import { EllipsisIcon, HeartIcon, CircleXMarkIcon, XIcon } from '@/assets/icons';
import type { CommentDisplayData } from '../../types';
import { useToggle } from 'usehooks-ts';

interface PostDetailsProps {
  onExit: () => void;
}

export default function PostDetails({ onExit }: PostDetailsProps) {
  const [showMenu, toggleMenu] = useToggle();
  const [showUpdateWindow, toggleUpdateWindow] = useToggle();
  const [comments, setComments] = useState([] as CommentDisplayData[]);
  const { formatTime } = useFormat();
  const { currentPost, likeHandler, addCommentHandler, removePost } =
    useContext(PostContext);
  const { user } = useContext(AuthContext);

  const fetchComments = useCallback(async () => {
    if (!currentPost) return;
    const response = await postApi.getComments(currentPost.id);
    if (response.success) setComments(response.data);
  }, [currentPost]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function commentSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const comment = (event.target as HTMLFormElement).comment.value;
    event.currentTarget.reset();
    await addCommentHandler(comment);
    fetchComments();
  }

  if (!currentPost) return null;
  return (
    <>
      {showUpdateWindow && (
        <UploadWindow
          method="put"
          defaultPost={currentPost}
          onExit={toggleUpdateWindow}
        />
      )}
      {showMenu && (
        <Overlay onExit={toggleMenu}>
          <Menu
            list={AUTHOR_POST_MENU.map((item) => {
              if (item.name === 'Cancel') {
                return {
                  ...item,
                  functionHandler: toggleMenu,
                };
              }
              if (item.name === 'Delete post') {
                return {
                  ...item,
                  functionHandler: async () => {
                    onExit();
                    toast.loading('Deleting post...');
                    const response = await postApi.deletePost(currentPost.id);
                    if (response.success) {
                      toast.success('Post deleted successfully');
                      removePost(currentPost.id);
                    } else toast.error('Failed to delete post');
                  },
                };
              }
              if (item.name === 'Edit post') {
                return {
                  ...item,
                  functionHandler: () => {
                    toggleMenu();
                    toggleUpdateWindow();
                  },
                };
              }
              return item;
            })}
          />
        </Overlay>
      )}

      <div
        className={clsx(
          'relative z-10',
          'size-full md:size-auto md:max-h-[98vh] max-w-full',
        )}
      >
        <div
          className={clsx(
            'surface',
            'size-full',
            'flex flex-col md:flex-row',
            'md:rounded-lg',
            'overflow-y-scroll md:overflow-hidden no-scrollbar',
            'pt-16 md:pt-0',
          )}
        >
          <div
            className={clsx(
              'surface dark:border-b',
              'h-16 w-full',
              'shrink-0',
              'flex md:hidden',
              'justify-center items-center',
              'absolute top-0 left-0 z-10',
            )}
          >
            <span className="font-semibold text-xl tracking-wide">
              {currentPost.username}'s Post
            </span>
            <button
              onClick={onExit}
              className={clsx(
                'absolute right-0',
                'mr-3',
                'hover:opacity-70 transition-opacity duration-300',
              )}
            >
              <CircleXMarkIcon
                className={clsx(
                  'size-8',
                  'fill-on-surface/[.6] dark:fill-dark-on-surface/[.7]',
                )}
              />
            </button>
          </div>

          <div
            className={clsx(
              'h-2/3 md:h-auto md:w-[48vw] aspect-square',
              'bg-on-surface/[0.1] dark:bg-dark-on-surface/[0.07]',
            )}
          >
            <FilesProvider initialFiles={currentPost.files}>
              <Carousel />
            </FilesProvider>
          </div>

          <div
            className={clsx(
              'flex flex-col md:max-h-[48vw]',
              'w-full md:w-80 lg:w-100 xl:w-120',
              'md:relative',
              'text-sm xl:text-base',
              'md:overflow-hidden',
            )}
          >
            <div className={clsx('flex justify-between', 'p-3')}>
              <Link
                to={`/profile/${currentPost.username}`}
                className={clsx(
                  'gap-x-3',
                  'flex items-center',
                  'inline-block w-fit',
                )}
              >
                <Avatar image={currentPost.avatar} size={'small'} />
                <p className="text-base xl:text-lg font-semibold">
                  {currentPost.username}
                </p>
              </Link>

              {user?.id === currentPost.uid && <button
                className={clsx(
                  'p-2',
                  'hover:opacity-70 transition-opacity duration-300',
                )}
                onClick={toggleMenu}
              >
                <EllipsisIcon
                  className={clsx(
                    'size-6',
                    'fill-on-surface/[0.87] dark:fill-dark-on-surface/[0.87]',
                  )}
                />
              </button>}
            </div>

            <Divider />

            <div
              className={clsx(
                'md:overflow-y-scroll md:no-scrollbar',
                'py-3 pb-36',
              )}
            >
              <div className={clsx('w-full', 'flex flex-col', 'gap-y-3 px-3')}>
                {currentPost.content && <CommentItem
                  avatar={currentPost.avatar}
                  username={currentPost.username}
                  content={currentPost.content}
                >
                  <span className="text-xs text-on-background/[0.6] dark:text-dark-on-background/[0.6]">
                    {formatTime(currentPost.createdAt)}
                  </span>
                </CommentItem>}
                {comments.map((comment) => (
                  <CommentItem key={comment.id} {...comment} postId={currentPost.id} >
                    <span className="text-xs text-on-background/[0.6] dark:text-dark-on-background/[0.6]">
                      {formatTime(comment.createdAt as string)}
                    </span>
                  </CommentItem>
                ))}
              </div>
            </div>

            <div className={clsx('absolute bottom-0', 'w-full', 'surface')}>
              <Divider />

              <div className={clsx('flex items-center', 'h-16 px-3')}>
                <div className="flex items-center">
                  <span
                    className={clsx(
                      'inline-block',
                      'size-7',
                      'cursor-pointer',
                      'hover:opacity-70 transition-opacity',
                    )}
                    onClick={() => likeHandler(currentPost.id)}
                  >
                    <HeartIcon
                      type={user && currentPost.likes.includes(user.id) ? 'solid' : 'regular'}
                      className={clsx('size-full', 'fill-love')}
                    />
                  </span>
                  <span className={clsx('mt-2 mb-1 ml-2', 'font-medium')}>
                    {currentPost.likes?.length} likes
                  </span>
                </div>
              </div>

              <Divider />

              <form
                onSubmit={commentSubmitHandler}
                className="flex justify-between items-center"
              >
                <textarea
                  name="comment"
                  className={clsx(
                    'flex-1',
                    'px-3 py-4',
                    'bg-transparent',
                    'outline-none resize-none',
                  )}
                  placeholder="Add a comment..."
                  rows={1}
                  spellCheck={false}
                />
                <button
                  type="submit"
                  className={clsx(
                    'simple-border-button',
                    'ml-2 mr-3 px-2 py-1',
                  )}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type CommentItemProps = PropsWithChildren<Partial<CommentDisplayData>> & {
  postId?: string;
};

function CommentItem({
  id,
  postId,
  uid,
  avatar,
  username,
  content,
  children,
}: CommentItemProps) {
  const { user } = useContext(AuthContext);
  const { deleteCommentHandler } = useContext(PostContext);

  return (
    <>
      <div className={clsx('flex', 'gap-x-2')}>
        <Avatar image={avatar} size={'small'} />
        <div className="flex flex-col grow relative">
          <p className="m-0 text-ellipsis overflow-hidden w-52 lg:w-72 xl:w-88">
            <Link
              to={`/profile/${username}`}
              className={clsx('inline-block mr-2', 'font-semibold')}
            >
              {username}
            </Link>
            {content}
          </p>
          {user!.id === uid && (
            <div className='h-full absolute top-0 right-0'>
              <span
                className={clsx(
                  'ms-auto px-3',
                  'fs-5',
                  'cursor-pointer opacity-50',
                  'hover:opacity-70 transition-opacity',
                )}
                role="button"
                onClick={() => deleteCommentHandler(id!, postId!)}
              >
                <XIcon
                  className={clsx(
                    'size-3',
                    'fill-on-surface/[0.87] dark:fill-dark-on-surface/[0.87]',
                  )}
                />
              </span>
            </div>
          )}
          <div className="">{children}</div>
        </div>
      </div>
    </>
  );
}
