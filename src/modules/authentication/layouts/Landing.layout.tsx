import clsx from 'clsx';
import { Header } from '@global';
import type { PropsWithChildren } from 'react';

import effects from '@sass/effects.module.sass';
import backgroundImageURL from '@assets/images/night-neon.avif';

type LandingProps = PropsWithChildren<{
  title: string;
}>;

export default function Landing({ title, children }: LandingProps) {
  return (
    <div className={clsx('w-screen h-svh', 'overflow-hidden select-none')}>
      <SubBackground />
      <div className={clsx('w-full xl:w-3/5 h-full', 'relative float-right')}>
        <Header brandHyperlink={false} />
        <div
          className={clsx(
            'flex flex-col justify-center items-center',
            'w-full h-[calc(100%-4rem)] px-4',
          )}
        >
          <span
            className={clsx(
              'block mb-4',
              'font-bold uppercase tracking-widest',
              'text-3xl md:text-4xl',
              'text-on-background/[0.8] dark:text-dark-on-background/[0.8]',
            )}
          >
            {title}
          </span>
          {children}
        </div>
      </div>
    </div>
  );
}

function SubBackground() {
  return (
    <div
      className={clsx('w-2/5 h-full float-left', 'hidden xl:block', 'relative')}
    >
      <div
        className={clsx(
          'bg-[linear-gradient(45deg,rgba(4,2,96,0.7),rgba(180,49,183,0.9)),linear-gradient(90deg,rgba(51,136,140,0.3),rgba(87,240,240,0.1))]',
          'size-full px-6',
          'absolute top-0 left-0',
          'flex flex-col justify-center items-center',
          'text-center text-white',
        )}
      >
        <div className="max-w-xl">
          <h1
            className={clsx(
              effects['text-neon-glowing-1'],
              'mb-3',
              'font-monoton text-3xl tracking-widest',
            )}
          >
            welcome back
          </h1>
          <div>
            The ultimate platform designed to bring people together through the
            power of media.
          </div>
        </div>
      </div>
      <img
        src={backgroundImageURL}
        alt="background"
        className="size-full object-cover"
      />
    </div>
  );
}
