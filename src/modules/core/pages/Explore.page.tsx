import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { toast, Loader } from '@global';
import { postApi } from '../api';
import { NoPosts } from '../components';
import { PostContext } from '../providers';
import { GridPostLayout, LayoutContext } from '../layouts';

export default function Explore() {
  const page = useRef(0);
  const isFetching = useRef(false);
  const { posts, setPosts } = useContext(PostContext);
  const { scrollRef } = useContext(LayoutContext);
  const [isLoaded, setLoaded] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    const response = await postApi.explorePosts(page.current);
    if (response.success) {
      setPosts((prevPosts) => [...(prevPosts || []), ...(response.data || [])]);
      if (response.data) {
        page.current += 1;
      }
    } else toast.error(response.message);
    isFetching.current = false;
  }, [setPosts]);

  useEffect(() => {
    (async function fetchFirstPage() {
      await fetchPosts();
      setLoaded(true);
    })();
  }, [fetchPosts]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        fetchPosts();
      }
    }
  }, [fetchPosts, scrollRef]);
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      if (scrollElement)
        scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, scrollRef]);

  if (!isLoaded) return <Loader.BoxSpin />;
  if (!posts) return null;
  if (posts?.length === 0) return <NoPosts />;
  return (
    <div className={clsx('max-w-screen-lg w-full min-h-[calc(100vh-11rem)]', 'px-4 pt-4 md:pt-12')}>
      <GridPostLayout />
      <div className="pb-4 md:pb-0" />
    </div>
  );
}
