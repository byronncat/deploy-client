import { useContext } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useToggle, useWindowSize } from 'usehooks-ts';
import clsx from 'clsx';

import { Overlay } from '@global';
import { PostContext } from '../../providers';
import { PostDetails } from '../../components';
import { Breakpoints } from '../../constants';
import { ImagesIcon } from '@assets/icons';

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
          return (
            <div
              key={post.id}
              className={clsx('relative', 'aspect-square', 'overflow-hidden')}
            >
              {post.files.length > 1 && (
                <ImagesIcon
                  className={clsx(
                    'size-6 m-1',
                    'absolute top-2 right-2',
                    'fill-white',
                  )}
                />
              )}
              <LazyLoadImage
                src={post.files[0].url}
                className={clsx('size-full', 'object-cover cursor-pointer')}
                onClick={() => {
                  selectCurrentPost(post.id);
                  toggleDetails();
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
