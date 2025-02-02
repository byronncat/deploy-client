import clsx from 'clsx';
import { ReactProps } from '@global';
import { MenuItem } from '../types/layout';

interface MenuProps extends ReactProps {
  list: MenuItem[];
  title?: string;
}

export default function Menu({ list, title }: MenuProps) {
  return (
    <ul
      className={clsx(
        'w-4/5 max-w-100',
        'text-center',
        'surface rounded-lg',
        'divide-y divider-on-surface/[.3] dark:divide-dark-on-surface/[.09]',
      )}
    >
      {title && (
        <li
          aria-current="true"
          className={clsx(
            'h-20',
            'flex items-center justify-center',
            'text-lg',
          )}
        >
          {title}
        </li>
      )}
      {list.map((item) => (
        <li
          key={item.name}
          aria-current="true"
          className={clsx(
            item.fontWeight === 'bold' && 'font-semibold',
            item.color === 'red' && ' text-[#ed4956]',
            item.color === 'blue' && ' text-[#0095f6]',
            'py-4',
            'cursor-pointer hover:bg-on-surface/[.07] dark:hover:bg-dark-on-surface/[0.05] transition-colors duration-300',
          )}
          onClick={item.functionHandler}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
