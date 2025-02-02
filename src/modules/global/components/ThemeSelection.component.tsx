import { useState } from 'react';
import clsx from 'clsx';
import { useThemeContext } from '../providers';
import { DisplayIcon, MoonIcon, SunIcon } from '@assets/icons';

type ThemeProps = {
  className?: string;
};

export default function ThemeSelection({ className }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, isDarkMode, setLightTheme, setDarkTheme, setSystemTheme } =
    useThemeContext();

  const options = [
    {
      label: 'Light',
      onClick: setLightTheme,
      icon: SunIcon,
      active: theme === 'light',
    },
    {
      label: 'Dark',
      onClick: setDarkTheme,
      icon: MoonIcon,
      active: theme === 'dark',
    },
    {
      label: 'System',
      onClick: setSystemTheme,
      icon: DisplayIcon,
      active: theme === 'system',
    },
  ];
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={className}>
      <button
        className={clsx(
          'p-2 rounded-full',
          'relative z-10',
          'transistion-colors duration-200',
          isOpen
            ? 'bg-on-surface/[.12] dark:bg-dark-on-surface/[.12]'
            : 'hover:bg-on-surface/[.12] dark:hover:bg-dark-on-surface/[.12]',
        )}
        onClick={toggleDropdown}
      >
        <span className="sr-only">Theme selection</span>
        {isDarkMode ? (
          <MoonIcon
            type={theme === 'system' ? 'regular' : 'solid'}
            className={clsx(
              'size-7',
              'fill-on-surface/[0.7] dark:fill-dark-on-surface/[0.7]',
            )}
          />
        ) : (
          <SunIcon
            type={theme === 'system' ? 'regular' : 'solid'}
            className={clsx(
              'size-6',
              'fill-on-surface/[0.7] dark:fill-dark-on-surface/[0.7]',
            )}
          />
        )}
      </button>

      {isOpen && (
        <>
          <span
            className={clsx('w-screen h-screen', 'absolute top-0 right-0 z-10')}
            onClick={toggleDropdown}
          />
          <div
            className={clsx(
              'w-40 mr-6 rounded-md',
              'absolute top-20 right-0 z-10',
              'shadow-xl overflow-hidden',
              'font-semibold',
              'text-on-surface/[0.8] dark:text-dark-on-surface/[0.8]',
              'border border-on-surface/[0.12] dark:border-dark-on-surface/[0.18]',
            )}
          >
            <div
              className={clsx(
                'size-full',
                'bg-surface dark:bg-dark-surface',
                'divide-y divide-on-surface/[0.12] dark:divide-dark-on-surface/[0.18]',
              )}
            >
              {options.map(({ label, onClick, icon, active }) => (
                <button
                  disabled={active}
                  key={label}
                  className={clsx(
                    'text-left',
                    'block w-full px-4 py-2',
                    active
                      ? 'text-on-surface/[0.5] dark:text-dark-on-surface/[0.6] bg-on-surface/[0.12] dark:bg-dark-on-surface/[0.07]'
                      : 'hover:bg-on-surface/[0.08] dark:hover:bg-dark-on-surface/[0.07]',
                  )}
                  onClick={() => {
                    onClick();
                    setIsOpen(false);
                  }}
                >
                  {icon({
                    type: 'solid',
                    className: clsx(
                      'size-5 mr-2',
                      'inline-block',
                      'fill-on-surface/[.6] dark:fill-dark-on-surface/[.7]',
                      active &&
                        'fill-on-surface/[.6] dark:fill-dark-on-surface/[.5]',
                    ),
                  })}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
