import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { toast, Loader } from '@global';
import { postApi } from '../api';
import { VerticalPostLayout, LayoutContext } from '../layouts';
import { PostContext } from '../providers';

export default function HomePage() {
  const page = useRef(0);
  const isFetching = useRef(false);
  const { scrollRef } = useContext(LayoutContext);
  const { posts, setPosts } = useContext(PostContext);
  const [isLoaded, setLoaded] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    const response = await postApi.getHomePosts(page.current);
    if (response.success) {
      setPosts((prevPosts) => [...(prevPosts || []), ...(response.data || [])]);
      if (response.data) {
        page.current += 1;
      }
    } else toast.error(response.message);
    isFetching.current = false;
  }, [setPosts]);

  useEffect(() => {
    (async () => {
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
  return <VerticalPostLayout className="py-4 md:py-6" />;
}
