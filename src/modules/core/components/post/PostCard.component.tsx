import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToggle, useWindowSize } from 'usehooks-ts';
import clsx from 'clsx';

import { Overlay, toast } from '@global';
import { useFormat } from '../../hooks';
import { PostContext, FilesProvider } from '../../providers';
import Avatar from '../Avatar.component';
import Carousel from './Carousel.component';
import PostDetails from './PostDetails.component';
import Divider from '../Divider.component';
import Menu from '../Menu.component';
import { EllipsisIcon, HeartIcon, CommentIcon } from '@assets/icons';
import { AUTHOR_POST_MENU, VIEWER_POST_MENU } from '../../constants';
import { UploadWindow } from './upload';
import { PROTECTED_ROUTE, usePath } from '@/route';
import { MenuItem } from '../../types';
import { AuthContext } from '@/modules/authentication';
import { postApi } from '../../api';

type PostCardProps = {
  id: string;
};

export default function PostCard({ id }: PostCardProps) {
  const { formatTime } = useFormat();
  const { getPostById, addCommentHandler, likeHandler } =
    useContext(PostContext);
  const { setPosts, selectCurrentPost } = useContext(PostContext);
  const { width = 0 } = useWindowSize();
  const { currentPath } = usePath();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const [showMenu, toggleMenu] = useToggle();
  const [showDetails, toggleDetails] = useToggle(false);
  const [showUpdateWindow, toggleUpdateWindow] = useToggle(false);

  const post = getPostById(id) || null;
  useEffect(() => {
  }, [post]);
  if (!post) return null;

  function commentChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }

  async function commentSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    await addCommentHandler(comment);
  }

  const menuList: MenuItem[] =
    user?.id === post.uid
      ? AUTHOR_POST_MENU.map((item) => {
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
                toggleMenu();
                toast.loading('Deleting post...');
                const response = await postApi.deletePost(post.id);
                if (response.success) {
                  if (currentPath === PROTECTED_ROUTE.HOME) {
                    setPosts(
                      (prev) => prev && prev.filter((p) => p.id !== post.id),
                    );
                  }
                  toast[response.success ? 'success' : 'error'](
                    response.message,
                  );
                }
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
        })
      : VIEWER_POST_MENU.map((item) => {
          if (item.name === 'Cancel')
            return {
              ...item,
              functionHandler: toggleMenu,
            };
          if (item.name === 'Go to post')
            return {
              ...item,
              functionHandler: () => {
                toggleMenu();
                toggleDetails();
              },
            };
          if (item.name === 'Go to profile')
            return {
              ...item,
              functionHandler: () => {
                navigate(`/profile/${post.username}`);
                toggleMenu();
              },
            };
          return item;
        });



  return (
    <>
      {showMenu && (
        <Overlay onExit={() => toggleMenu()}>
          <Menu list={menuList} />
        </Overlay>
      )}
      {showDetails && (
        <Overlay onExit={toggleDetails} closeButtonShown={width >= 768}>
          <PostDetails onExit={toggleDetails} />
        </Overlay>
      )}
      {showUpdateWindow && (
        <UploadWindow
          onExit={() => {
            toggleUpdateWindow();
          }}
          method="put"
          defaultPost={post}
        />
      )}

      <div
        className={clsx(
          'surface',
          'rounded-lg',
          'w-full aspect-9/16 max-h-screen',
          'flex flex-col gap-y-4',
        )}
        key={post.id}
      >
        <header className={clsx('flex', 'p-4 pb-0', 'relative')}>
          <Avatar image={post.avatar} />
          <div className={clsx('ml-3', 'flex items-center')}>
            <Link
              className={clsx('block', 'font-semibold text-lg')}
              to={`/profile/${post.username}`}
            >
              {post.username}
            </Link>
            <span className="mx-2 text-2xl">&middot;</span>
            <span
              className={clsx(
                'block',
                'opacity-70',
                'text-on-surface dark:text-dark-on-surface',
              )}
            >
              {formatTime(post.createdAt)}
            </span>
          </div>

          <button
            className={clsx('p-3', 'absolute top-4 right-4')}
            onClick={toggleMenu}
            aria-label="post-menu"
          >
            <EllipsisIcon
              className={clsx(
                'size-5',
                'opacity-70',
                'fill-on-surface dark:fill-dark-on-surface',
              )}
            />
          </button>
        </header>

        <div
          className={clsx(
            'bg-on-surface/[0.01] dark:bg-dark-on-surface/[0.07]',
            'flex-1',
          )}
        >
          <FilesProvider initialFiles={post.files}>
            <Carousel />
          </FilesProvider>
        </div>

        <main>
          <div className={clsx('flex items-center space-x-5', 'px-4')}>
            <div className={clsx('flex items-center')}>
              <button
                className={clsx(
                  'inline-block',
                  'size-7',
                  'cursor-pointer hover:opacity-70 transition-opacity',
                )}
                onClick={() => 
                  likeHandler(post.id)
                }
              >
                <HeartIcon
                  type={user && post.likes.includes(user.id) ? 'solid' : 'regular'}
                  className={clsx('size-full', 'fill-love')}
                />
              </button>
              {post.likes.length > 0 && (
                <span className={clsx('inline-block ml-3')}>
                  {post.likes.length} likes
                </span>
              )}
            </div>

            <div className={clsx('flex items-center')}>
              <button
                className={clsx(
                  'inline-block',
                  'size-7',
                  'cursor-pointer hover:opacity-70 transition-opacity',
                )}
                onClick={() => {
                  selectCurrentPost(post.id);
                  toggleDetails();
                }}
              >
                <CommentIcon
                  className={clsx(
                    'size-full',
                    'fill-on-surface dark:fill-dark-on-surface',
                  )}
                />
              </button>
              {post.comments > 0 && (
                <span className={clsx('inline-block ml-3')}>
                  {post.comments} comments
                </span>
              )}
            </div>
          </div>

          <Link
            className={clsx(
              'inline-block primary',
              'p-2 mt-4 min-w-20',
              'font-semibold text-on-primary text-center',
              'transition-opacity hover:opacity-70 duration-200',
            )}
            to={`/profile/${post.username}`}
          >
            {post.username}
          </Link>

          {post.content && (
            <p className={clsx('block p-4 pb-0')}>{post.content}</p>
          )}
        </main>

        <footer className="px-4 mb-1">
          <Divider className="my-1 mx-[-1rem]" />
          <form
            onSubmit={commentSubmitHandler}
            className={clsx('flex justify-between items-center', 'w-full')}
          >
            <textarea
              name="comment"
              className={clsx(
                'grow py-3',
                'bg-transparent',
                'outline-none resize-none',
              )}
              placeholder="Add a comment..."
              rows={1}
              spellCheck={false}
              onChange={commentChangeHandler}
            />
            <button
              type="submit"
              disabled={!comment}
              className={clsx(
                'h-full ml-3 p-3',
                'text-primary font-bold',
                'hover:opacity-70 transition-opacity',
                'disabled:opacity-50',
              )}
            >
              Post
            </button>
          </form>
        </footer>
      </div>
    </>
  );
}
