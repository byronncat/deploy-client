import clsx from 'clsx';
import { Loader } from '../components';
import logoURL from '@assets/images/logo.svg';

export default function LoadingPage() {
  return (
    <div className={clsx('w-screen h-svh', 'relative', 'flex justify-center')}>
      <Loader.BoxSpin className="flex-1" />
      <div
        className={clsx(
          'absolute bottom-0',
          'flex flex-col items-center',
          'pb-6',
        )}
      >
        <span className="text-on-background/[0.6] dark:text-dark-on-background/[0.6]">
          from
        </span>
        <div className="flex items-center">
          <img className="block size-8 mr-2" src={`${logoURL}`} alt="logo" />
          <span
            className={clsx(
              'font-semibold text-xl',
              'text-on-background/[0.87] dark:text-dark-on-background/[0.87]',
            )}
          >
            Bygram
          </span>
        </div>
      </div>
    </div>
  );
}
