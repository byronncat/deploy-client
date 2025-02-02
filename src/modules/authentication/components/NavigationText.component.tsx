import { Link } from 'react-router-dom';
import clsx from 'clsx';

type NavigationTextProps = {
  text: string;
  navigateText: string;
  path: string;
};

export default function NavigationText({
  text,
  navigateText,
  path,
}: NavigationTextProps) {
  return (
    <p className={clsx('w-full', 'text-center')}>
      {`${text} `}
      <Link
        to={path}
        className={clsx(
          'font-semibold capitalize',
          'text-primary dark:text-dark-primary',
          'hover:opacity-60 transition-opacity duration-300',
        )}
      >
        {navigateText}
      </Link>
    </p>
  );
}
