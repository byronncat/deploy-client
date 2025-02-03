import { useContext } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useToggle, useWindowSize } from 'usehooks-ts';
import clsx from 'clsx';

import { Overlay } from '@global';
import { PostContext } from '../../providers';
import { PostDetails } from '../../components';
import { Breakpoints } from '../../constants';
import { ImagesIcon, PhotoFilmIcon } from '@assets/icons';

export default function Grid() {
  const [showDetails, toggleDetails] = useToggle();
  const { posts, selectCurrentPost } = useContext(PostContext);
  const { width = 0 } = useWindowSize();

  if (!posts) return null;
  return (
    <>
      {showDetails && (
        <Overlay
          onExit={toggleDetails}
          closeButtonShown={width >= Breakpoints.md}
        >
          <PostDetails onExit={toggleDetails} />
        </Overlay>
      )}

      <div className={clsx('w-full', 'grid grid-cols-2 md:grid-cols-3 gap-2')}>
        {posts.map((post) => {
          const containVideo = post.files.some((file) => file.type === 'video');
          return (
            <div
              key={post.id}
              className={clsx('relative', 'aspect-square', 'overflow-hidden', 'group cursor-pointer')}
              onClick={() => {
                selectCurrentPost(post.id);
                toggleDetails();
              }}
            >
              {containVideo ? 
                <PhotoFilmIcon
                  className={clsx(
                    'size-6 m-1',
                    'absolute top-2 right-2',
                    'fill-white',
                  )}
                />
              : post.files.length > 1 && (
                <ImagesIcon
                  className={clsx(
                    'size-6 m-1',
                    'absolute top-2 right-2',
                    'fill-white',
                  )}
                />
              )}
              <div
                className={clsx(
                  'absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300',
                  'group-hover:opacity-100 opacity-0',
                )}
              />
              {post.files[0].type === 'image' ? <LazyLoadImage
                src={post.files[0].url}
                className={clsx('size-full', 'object-cover object-center')}
              /> : 
              <video width="360" muted ref={(video) => video && video.pause()} className={clsx('size-full', 'object-cover object-center')} >
                <source src={`${post.files[0].url}`} type="video/mp4" />
              </video>
              }
            </div>
          );
        })}
      </div>
    </>
  );
}
