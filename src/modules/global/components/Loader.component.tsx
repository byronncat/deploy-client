import clsx from 'clsx';
import styles from '../styles/components/loader.module.sass';

type LoaderProps = {
  className?: string;
};

function BoxSpin({ className }: LoaderProps) {
  return (
    <div
      className={clsx('flex flex-col justify-center items-center', className)}
    >
      <div>
        <div
          className={clsx(
            styles['configure-border-1'],
            'size-28 p-0.5',
            'absolute flex justify-center items-center',
          )}
        >
          <span
            className={clsx(styles['configure-core'], 'size-full background')}
          />
        </div>
        <div
          className={clsx(
            styles['configure-border-2'],
            'flex justify-center items-center',
            'size-28 p-0.5',
            'rotate-45',
          )}
        >
          <span
            className={clsx(
              styles['configure-core'],
              `dark:${styles['configure-core']}`,
              'size-full background',
            )}
          />
        </div>
      </div>
      <div
        className={clsx(
          styles.waviy,
          'text-white',
          'px-5 py-2 mt-16 rounded',
          'font-bold text-2xl tracking-widest',
          'primary',
        )}
      >
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>
    </div>
  );
}

function Regular() {
  return (
    <div
      className={clsx(
        'size-10',
        'rounded-full animate-spin',
        'border-4 border-solid border-t-transparent dark:border-t-transparent',
        'border-primary dark:border-dark-primary',
      )}
    />
  );
}

const Loader = {
  BoxSpin,
  Regular,
};

export default Loader;
