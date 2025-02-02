import { useContext } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import clsx from 'clsx';

import { CloudinaryContext } from '../providers/Cloudinary.provider';
import type { MediaInfo } from '../types';

interface AvatarProps {
  size?: 'small' | 'medium' | 'large';
  image?: MediaInfo;
  className?: string;
}

export default function Avatar({
  size = 'small',
  image,
  className,
}: AvatarProps) {
  const { DefaultAvatar } = useContext(CloudinaryContext);
  const isEmpty = !image || !image.url;
  return (
    <div
      className={clsx(
        className,
        size === 'small' && `size-12`,
        size === 'medium' && `size-36`,
        size === 'large' && `size-48`,
        `inline-block`,
        'rounded-full overflow-hidden',
        'flex justify-center items-center shrink-0',
        'border-2 border-primary dark:border-dark-primary',
      )}
    >
      <span
        className={clsx(
          size === 'small' && `size-10`,
          size === 'medium' && `size-34`,
          size === 'large' && `size-46`,
          `block`,
          'rounded-full overflow-hidden',
        )}
      >
        {isEmpty ? (
          <DefaultAvatar />
        ) : (
          <LazyLoadImage
            className={clsx(
              image?.orientation === 'portrait'
                ? 'w-full h-auto'
                : 'w-auto h-full',
            )}
            alt="profile"
            src={image?.url}
          />
        )}
      </span>
    </div>
  );
}
