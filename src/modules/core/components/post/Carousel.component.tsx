import { useRef } from 'react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { animated, Controller } from '@react-spring/web';
import clsx from 'clsx';

import { useFilesContext } from '../../providers';
import { CircleChevronIcon } from '@assets/icons';

export default function Carousel() {
  const { files, currentIndex, navigateIndex: goToSlide } = useFilesContext();
  const slideStyle = useRef(new Controller());

  function slideEffect(direction: 'left' | 'right') {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    slideStyle.current
      .start({
        from: {
          [direction]: '100%',
          [oppositeDirection]: 'unset',
        },
        immediate: true,
      })
      .then(() => {
        slideStyle.current.start({
          to: {
            [direction]: '0%',
          },
          config: {
            duration: 300,
          },
        });
      });
  }

  function propagationHandler(
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) {
    event.stopPropagation();
  }

  return (
    <div className={clsx('size-full', 'relative', 'overflow-hidden')}>
      {files.map((file, index) => {
        return (
          <div
            key={file.id || file._id}
            className={clsx(
              'size-full',
              'bg-on-background/[0.12] dark:bg-on-background/[0.42]',
              'opacity-0',
              index === currentIndex ? 'absolute opacity-100 block' : 'hidden',
            )}
          >
            <animated.div
              className={clsx(
                'flex items-center justify-center',
                'size-full',
                files.length > 1 && 'absolute top-0',
              )}
              style={slideStyle.current.springs}
            >
              <LazyLoadComponent>
                {file.type.includes('video') ? (
                  <video
                    src={file.url}
                    className={clsx(
                      'block',
                      file.orientation === 'landscape'
                        ? 'w-full h-auto'
                        : 'w-auto h-full',
                    )}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={file.url}
                    className={clsx(
                      'block object-fit',
                      file.orientation === 'landscape'
                        ? 'w-full h-auto'
                        : 'w-auto h-full',
                    )}
                    alt="post-file"
                  />
                )}
              </LazyLoadComponent>
            </animated.div>
          </div>
        );
      })}

      {files.length > 1 && (
        <>
          <div
            className={clsx(
              'absolute',
              'flex space-x-3',
              '-translate-x-1/2 rtl:space-x-reverse bottom-5 left-1/2',
            )}
            onClick={propagationHandler}
          >
            {files.map((file, index) => (
              <button
                key={file.id || file._id}
                type="button"
                className={clsx(
                  'primary',
                  'size-4 rounded-full',
                  'transition-opacity duration-300',
                  index === currentIndex
                    ? 'opacity-100'
                    : 'opacity-40 hover:opacity-100',
                )}
                aria-current={index === currentIndex}
                aria-label={`file ${index + 1}`}
                onClick={() => {
                  if (index === currentIndex) return;
                  goToSlide(index);
                  slideEffect(index < currentIndex ? 'right' : 'left');
                }}
              />
            ))}
          </div>

          {currentIndex !== 0 && (
            <button
              type="button"
              className={clsx(
                'absolute top-0 left-0',
                'flex items-center justify-center',
                'h-full px-4',
                'cursor-pointer group focus:outline-none',
              )}
              onClick={(e) => {
                propagationHandler(e);
                goToSlide(currentIndex - 1);
                slideEffect('right');
              }}
            >
              <span className="sr-only">Previous</span>
              <CircleChevronIcon
                direction="left"
                className={clsx(
                  'size-8',
                  'fill-primary',
                  'dark:fill-dark-primary',
                  'opacity-60 group-hover:opacity-100',
                  'transition-opacity duration-300',
                )}
              />
            </button>
          )}
          {currentIndex !== files.length - 1 && (
            <button
              type="button"
              className={clsx(
                'absolute top-0 right-0',
                'flex items-center justify-center',
                'h-full px-4',
                'cursor-pointer group focus:outline-none',
              )}
              onClick={(e) => {
                propagationHandler(e);
                goToSlide(currentIndex + 1);
                slideEffect('left');
              }}
            >
              <span className="sr-only">Next</span>
              <CircleChevronIcon
                direction="right"
                className={clsx(
                  'size-8',
                  'fill-primary',
                  'dark:fill-dark-primary',
                  'opacity-60 group-hover:opacity-100',
                  'transition-opacity duration-300',
                )}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
}
