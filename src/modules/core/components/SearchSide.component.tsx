import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';
import clsx from 'clsx';

import { AuthContext } from '@authentication';
import { profileApi } from '../api';
import { SidebarContext } from '../providers';
import { SIDEBAR_OPTION } from '../constants';
import { CircleXMarkIcon } from '@assets/icons';

import type { SearchData } from '../types';
import Avatar from './Avatar.component';

interface SearchSideProps {
  isShow: boolean;
  onExit: () => void;
}

function SearchSide({ isShow, onExit }: SearchSideProps) {
  const SearchElement = useRef<HTMLTextAreaElement>(null);
  const { setOption } = useContext(SidebarContext);
  const { user } = useContext(AuthContext);
  const [searchInput, setSearchRealtime] = useState('');
  const [searchResult, setSearchResult] = useState<SearchData[]>([]);
  const [debouncedSearchInput, setSearchInput] = useDebounceValue<string>(
    '',
    1200,
  );

  function navigateProfileHandler() {
    setOption(SIDEBAR_OPTION.PROFILE);
    onExit();
  }

  function textInputHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    // when event.target.value is empty, it will not neccessary to reset setSearchRealtime
    // because pointer is already at the end of the input. But setSearchInput
    // still need to be reset (lowerCase not empty)
    const lowerCase = event.target.value.toLowerCase();
    setSearchInput(lowerCase);
    setSearchRealtime(event.target.value);
  }

  const clearSearchHandler = useCallback(() => {
    if (SearchElement.current) {
      SearchElement.current.value = '';
    }
    setSearchInput('');
  }, [SearchElement, setSearchInput]);

  const focusSearchHandler = useCallback(() => {
    if (SearchElement.current) {
      SearchElement.current.focus();
    }
  }, [SearchElement]);

  useEffect(() => {
    if (isShow) focusSearchHandler();
    else {
      clearSearchHandler();
      setSearchResult([]);
    }
  }, [isShow, clearSearchHandler, focusSearchHandler]);

  useEffect(() => {
    // ! searchInput if empty became /api/profile/search match wrong route
    if (debouncedSearchInput) {
      (async function search() {
        const response = await profileApi.searchProfile(debouncedSearchInput);
        if (response.success) setSearchResult(response.data || []);
      })();
    }
  }, [debouncedSearchInput]);

  return (
    <>
      {isShow && (
        <span
          className={clsx(
            'h-screen w-screen',
            'absolute -top-16 left-0',
            'hidden md:block',
          )}
          onClick={onExit}
        />
      )}
      <div
        className={clsx(
          'surface',
          'flex flex-col',
          'px-4 pt-20 pb-3',
          'h-svh md:h-full md:w-100',
          'absolute bottom-0 left-0 right-0',
          'shadow-none md:shadow-md dark:shadow-none',
          'transition-all ease-in duration-300',
          'border-r border-on-surface/[.12] dark:border-dark-on-surface/[.12]',
          isShow ? 'block' : 'hidden md:block',
          isShow
            ? 'md:left-20 md:translate-x-0 md:opacity-100'
            : 'md:left-0 md:-translate-x-full md:opacity-0',
        )}
      >
        <span
          className={clsx(
            'flex items-center h-12',
            'font-semibold text-2xl capitalize tracking-wide',
          )}
        >
          search
        </span>
        <div
          className={clsx(
            'flex items-center',
            'h-10 my-4',
            'relative',
            'bg-on-surface/[0.04] dark:bg-dark-on-surface/[0.07]',
          )}
        >
          <textarea
            ref={SearchElement}
            className={clsx(
              'peer flex-grow',
              'h-full p-2',
              'bg-transparent',
              'resize-none outline-none',
              'duration-300 opacity-80 hover:opacity-100 focus:opacity-100',
            )}
            rows={1}
            placeholder="What's on your mind?"
            spellCheck="false"
            onChange={textInputHandler}
          />
          {searchInput !== '' && (
            <button
              className={clsx(
                'h-full pr-3',
                'flex justify-center items-center',
                'opacity-60 peer-focus:opacity-90 hover:!opacity-60',
                'transition-opacity duration-300',
              )}
              onClick={clearSearchHandler}
            >
              <CircleXMarkIcon
                className={clsx(
                  'size-4',
                  'cursor-pointer',
                  'fill-on-background/[0.8] dark:fill-dark-on-background',
                )}
              />
            </button>
          )}
        </div>
        <div className={clsx('grow overflow-y-auto', '-mx-4 py-4 space-y-1')}>
          {searchResult.map((result) => {
            if (result.id === user?.id) return null;
            return (
              <Link
                to={`/profile/${result.username}`}
                key={result.id}
                className={clsx(
                  'flex items-center',
                  'px-4 py-2',
                  'transition-opacity duration-300',
                  'opacity-70 hover:opacity-100 hover:bg-primary/[.4]',
                )}
                onClick={navigateProfileHandler}
              >
                <span
                  className={clsx(
                    'block size-12',
                    'rounded-full',
                    'overflow-hidden',
                  )}
                >
                  <Avatar size="small" image={result.avatar} />
                </span>
                <p className="ms-3 text-lg">{result.username}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SearchSide;
