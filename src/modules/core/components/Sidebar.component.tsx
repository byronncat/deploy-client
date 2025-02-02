import { cloneElement, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useWindowSize, useToggle } from 'usehooks-ts';
import clsx from 'clsx';

import { toast } from '@global';
import { authenticationApi, AuthContext } from '@authentication';
import { LoadContext } from '../hocs';
import { UploadWindow } from './post/upload';
import { SidebarContext } from '../providers';
import { SearchSide } from '.';
import {
  CompassIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  RightFromBracketIcon,
  SquarePlusIcon,
  UserIcon,
} from '@assets/icons';

import { SIDEBAR_OPTION, SidebarOptionStrings } from '../constants';

type SidebarLink = {
  name: SidebarOptionStrings;
  icon: JSX.Element;
  path: string;
  className?: string;
};

const Sidebar = () => {
  const { width = 0 } = useWindowSize();
  const { toggleLoaded } = useContext(LoadContext);
  const { user, logout } = useContext(AuthContext);
  const { isMinimize, toggleIsMinimize, option, setOption, optionBack } =
    useContext(SidebarContext);

  const [showSearch, toggleShowSearch] = useToggle(false);
  const [showCreateWindow, toggleCreateWindow] = useToggle(false);

  if (!user) return null;

  function toggleSearchHandler() {
    toggleIsMinimize();
    toggleShowSearch();
  }

  function selectOptionHandler(clickedOption: SidebarOptionStrings) {
    if (clickedOption === SIDEBAR_OPTION.LOGOUT) return logoutHandler();
    if (clickedOption === SIDEBAR_OPTION.CREATE) return toggleCreateWindow();
    if (isMinimize && clickedOption === SIDEBAR_OPTION.SEARCH) {
      toggleSearchHandler();
      return optionBack();
    }
    if (option === SIDEBAR_OPTION.SEARCH) {
      toggleSearchHandler();
    }
    if (clickedOption === SIDEBAR_OPTION.SEARCH) {
      toggleSearchHandler();
      return setOption(clickedOption);
    }
    return setOption(clickedOption);
  }

  async function logoutHandler() {
    toggleLoaded();
    const response = await authenticationApi.logout();
    if (response.success) {
      logout();
      toast.success('Logout successful');
    } else toast.error('Logout failed');
    toggleLoaded();
  }

  const SIDEBAR_MENU = [
    {
      name: SIDEBAR_OPTION.HOME,
      icon: <HouseIcon color="white" />,
      path: '/',
    },
    {
      name: SIDEBAR_OPTION.SEARCH,
      icon: <MagnifyingGlassIcon color="white" />,
      path: '#',
    },
    {
      name: SIDEBAR_OPTION.EXPLORE,
      icon: <CompassIcon color="white" />,
      path: '/explore',
    },
    {
      name: SIDEBAR_OPTION.CREATE,
      icon: <SquarePlusIcon color="white" />,
      path: '#',
    },
    {
      name: SIDEBAR_OPTION.PROFILE,
      icon: <UserIcon color="white" />,
      path: `/profile/${user?.username}`,
    },
    {
      name: SIDEBAR_OPTION.LOGOUT,
      icon: <RightFromBracketIcon color="white" />,
      path: '#',
      className: 'hidden md:block',
    },
  ] as SidebarLink[];

  return (
    <>
      {showCreateWindow && (
        <UploadWindow onExit={toggleCreateWindow} method="post" />
      )}
      <div
        className={clsx(
          'w-full h-16 md:w-20 xl:w-64 md:h-full',
          'absolute md:static bottom-0 z-10',
        )}
      >
        <SearchSide
          isShow={showSearch}
          onExit={() => {
            toggleSearchHandler();
            optionBack();
          }}
        />
        <nav
          className={clsx(
            'surface',
            'h-full md:pt-4',
            'relative z-10',
            'transition-[width] duration-300',
            'shadow-md dark:shadow-none',
            'border-t md:border-r border-on-surface/[.07] dark:border-dark-on-surface/[.12]',
            isMinimize ? `w-full md:w-20` : 'w-full md:w-20 xl:w-64',
          )}
        >
          <ul
            className={clsx(
              'size-full',
              'flex md:flex-col',
              'items-center justify-around md:justify-start',
            )}
          >
            {SIDEBAR_MENU.map((tag) => {
              return (
                <li
                  key={tag.name}
                  className={clsx(
                    tag.className,
                    'mb-0 md:mb-3 h-12 ',
                    isMinimize ? 'w-12' : 'w-12 xl:w-48',
                  )}
                  aria-current="page"
                >
                  <Link
                    id={tag.name}
                    to={tag.path}
                    className={clsx(
                      'group',
                      'w-full h-full px-3 rounded-lg',
                      'flex items-center',
                      'font-medium capitalize',
                      'transition-all duration-300',
                      width <= 1280 ? 'justify-center' : 'justify-start',
                      isMinimize && 'justify-center',
                      option === tag.name
                        ? clsx(
                            'bg-primary text-on-primary',
                            'dark:bg-dark-primary/[.8 ]',
                            'font-semibold tracking-wider',
                          )
                        : clsx(
                            'text-on-surface/[0.87] hover:text-surface',
                            'dark:text-dark-on-surface/[0.87] dark:hover:text-surface',
                            'hover:bg-primary/[.6] active:text-surface active:bg-primary/[.7]',
                            'dark:hover:bg-dark-primary/[.3] dark:active:text-surface dark:active:bg-dark-primary/[.5]',
                          ),
                    )}
                    onClick={() => selectOptionHandler(tag.name)}
                  >
                    {cloneElement(tag.icon, {
                      className: clsx(
                        'size-5',
                        'transition-all duration-300',
                        option === tag.name
                          ? 'fill-on-primary'
                          : clsx(
                              'fill-on-surface/[0.7] group-hover:fill-surface group-active:fill-surface group-active:scale-95',
                              'dark:fill-dark-on-surface/[0.87] dark:group-hover:fill-dark-on-surface dark:group-active:fill-dark-surface dark:group-active:scale-95',
                            ),
                      ),
                    })}
                    <p
                      className={clsx(
                        'ms-3',
                        'whitespace-nowrap',
                        isMinimize ? 'hidden' : 'hidden xl:block',
                      )}
                    >
                      {tag.name}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
