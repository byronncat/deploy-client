import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

type ErrorPageProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode = 400 }: ErrorPageProps) {
  const backButton = useRef<HTMLAnchorElement>(null);
  let content = {
    heading: 'Something went wrong!',
    message: 'Please try again later.',
  };

  if (statusCode === 404)
    content = {
      heading: 'Page not found',
      message:
        'The page you are looking for might have been removed or is temporarily unavailable.',
    };

  useLayoutEffect(() => {
    backButton.current?.focus();
  }, []);

  return (
    <div className={clsx('w-screen h-svh', 'flex justify-center items-center')}>
      <div className={clsx('flex flex-col items-center', 'px-12 text-center')}>
        <div
          className={clsx('text-center', 'w-full')}
          style={{
            background:
              'radial-gradient(50% 109137.91% at 50% 50%, rgba(176, 0, 32, 0.2) 0%, rgba(254, 244, 247, 0) 100%)',
          }}
        >
          <div
            className={clsx(
              'inline-block px-4 py-1',
              'font-bold text-3xl',
              'bg-error dark:bg-dark-error',
            )}
          >
            <span className="text-white">{statusCode}</span>
          </div>
        </div>
        <h1
          className={clsx(
            'mt-12 mb-10',
            'font-bold text-5xl',
            'text-on-background dark:text-dark-on-background',
          )}
        >
          {content.heading}
        </h1>
        <p
          className={clsx(
            'text-on-background/[0.6] dark:text-dark-on-background/[0.6]',
            'mb-10',
          )}
        >
          {content.message}
        </p>
        <Link
          to="/"
          className={clsx('px-12 py-3', 'simple-border-button')}
          ref={backButton}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
