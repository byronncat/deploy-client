import clsx from 'clsx';

export default function Divider() {
  return (
    <div
      className={clsx(
        'mt-5 mb-3',
        'flex items-center',
        'text-xs uppercase',
        'text-on-surface/[0.87] dark:text-dark-on-surface/[0.4]',
        'before:flex-1 before:border-t before:me-6 after:flex-1 after:border-t after:ms-6',
        'before:text-on-surface after:text-on-surface',
        'dark:before:border-dark-on-surface/[0.12] dark:after:border-dark-on-surface/[0.12]',
      )}
    >
      or
    </div>
  );
}
