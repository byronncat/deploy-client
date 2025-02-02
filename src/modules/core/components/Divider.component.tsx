import clsx from 'clsx';

type DividerProps = {
  className?: string;
};

export default function Divider({ className }: DividerProps) {
  return (
    <span
      className={clsx(
        className,
        'block',
        'border-b border-on-surface/[0.2] dark:border-dark-on-surface/[0.4]',
      )}
    />
  );
}
