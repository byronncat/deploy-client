import { InstagramIcon } from '@assets/icons';
import clsx from 'clsx';

export default function NoPosts() {
  return (
    <div
      className={clsx('size-full', 'flex flex-col justify-center items-center')}
    >
      <InstagramIcon
        className={clsx(
          'size-20',
          'fill-on-background/[.5] dark:fill-dark-on-background/[.7]',
        )}
      />
      <h2 className={clsx('text-xl capitalize', 'mt-4 mb-1')}>no posts yet</h2>
      <p>It seems that there are no posts.</p>
    </div>
  );
}
