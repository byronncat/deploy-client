import { MouseEventHandler } from 'react';
import clsx from 'clsx';
import { XIcon } from '@assets/icons';
import type { MouseEvent } from 'react';
import type { PropsWithChildren } from 'react';

type OverlayProps = PropsWithChildren<{
  onExit: MouseEventHandler;
  closeButtonShown?: boolean;
}>;

export default function Overlay({
  children,
  onExit,
  closeButtonShown = true,
}: OverlayProps) {
  function overlayHandler(e: MouseEvent) {
    if (e.target === e.currentTarget) onExit(e);
  }

  return (
    <div
      className={clsx(
        'absolute top-0 start-0 z-30',
        'w-screen h-dvh bg-on-surface/[0.6]',
        'flex justify-center items-center',
        'overflow-auto',
      )}
      onClick={overlayHandler}
    >
      {closeButtonShown && (
        <button
          className={clsx(
            'absolute top-0 right-0 z-10',
            'p-2 mt-2 mr-2 lg:mr-4',
            'primary',
            'hover:opacity-80 duration-300',
          )}
          aria-label="close"
          onClick={onExit}
        >
          <XIcon className={clsx('size-6', 'fill-white')} />
        </button>
      )}
      {children}
    </div>
  );
}
