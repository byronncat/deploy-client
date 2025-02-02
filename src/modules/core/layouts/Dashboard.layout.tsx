import { createContext, useContext, useRef } from 'react';
import clsx from 'clsx';
import { Header } from '@global';
import { Sidebar } from '../components';
import type { PropsWithChildren } from 'react';
import { AuthContext } from '@/modules/authentication';

export const LayoutContext = createContext(
  {} as {
    scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  },
);

export default function ColumnLayout({ children }: PropsWithChildren) {
  // * /images/wallpaper.jpg different from images/wallpaper.jpg
  const scrollRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <LayoutContext.Provider
      value={{
        scrollRef,
      }}
    >
      <div
        className={clsx(
          'h-svh md:h-screen',
          'relative md:static',
          'flex flex-col',
        )}
      >
        <Header loginShown={!isLoggedIn} />
        <div className={clsx('flex flex-1', 'overflow-hidden')}>
          <Sidebar />
          <main
            className={clsx('w-full', 'flex-1', 'overflow-y-auto')}
            ref={scrollRef}
          >
            <div
              className={clsx(
                'pb-16',
                'min-h-full h-max',
                'flex justify-center items-center',
              )}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
