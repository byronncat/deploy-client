import { createContext, useContext, useEffect } from 'react';
import { useToggle } from 'usehooks-ts';

import { ROUTE, usePath } from '@route';
import { AuthContext } from '@authentication';
import { useStateWithHistory } from '../hooks';
import { SIDEBAR_OPTION, SidebarOptionStrings } from '../constants';
import type { PropsWithChildren } from 'react';

export const SidebarContext = createContext(
  {} as {
    isMinimize: boolean;
    toggleIsMinimize: () => void;
    option: SidebarOptionStrings;
    setOption: (name: SidebarOptionStrings) => void;
    optionBack: () => void;
  },
);

export default function Sidebar({ children }: PropsWithChildren) {
  const { currentPath } = usePath();
  const { isLoggedIn } = useContext(AuthContext);
  const [isMinimize, toggleIsMinimize] = useToggle(false);
  const [option, setOption, { back }] =
    useStateWithHistory<SidebarOptionStrings>(() => {
      if (currentPath === ROUTE.EXPLORE) return SIDEBAR_OPTION.EXPLORE;
      if (currentPath === ROUTE.PROFILE) return SIDEBAR_OPTION.PROFILE;
      return SIDEBAR_OPTION.HOME;
    });

  useEffect(() => {
    if (currentPath === ROUTE.HOME) setOption(SIDEBAR_OPTION.HOME);
    if (currentPath === ROUTE.EXPLORE) setOption(SIDEBAR_OPTION.EXPLORE);
    if (currentPath === ROUTE.PROFILE) setOption(SIDEBAR_OPTION.PROFILE);
  }, [currentPath]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoggedIn) return <>{children}</>;
  return (
    <SidebarContext.Provider
      value={{
        isMinimize,
        toggleIsMinimize,
        option,
        setOption,
        optionBack: back,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
