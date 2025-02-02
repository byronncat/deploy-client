import { useContext } from 'react';
import clsx from 'clsx';
import { NoPosts, PostCard } from '../../components';
import { PostContext } from '../../providers';

type VerticalProps = {
  className?: string;
};

export default function Vertical({ className }: VerticalProps) {
  const { posts } = useContext(PostContext);
  if (!posts) return null;
  return (
    <div
      className={clsx(
        className,
        'w-160 max-w-full',
        'flex flex-col items-center',
        'gap-y-5',
      )}
    >
      {posts.length === 0 && <NoPosts />}
      {posts.map((post) => {
        return <PostCard id={post.id} key={post.id} />;
      })}
    </div>
  );
}
