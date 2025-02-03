import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ThemeSelection } from '.';
import logoURL from '@assets/images/logo.svg';
import { useCallback, useEffect, useState } from 'react';

type HeaderProps = {
  loginShown?: boolean;
  brandHyperlink?: boolean;
};

export default function Header({ loginShown, brandHyperlink }: HeaderProps) {
  const [isShown, setShown] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (window.scrollY > lastScrollY) setShown(false);
    else setShown(true);
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY, controlNavbar]);

  return (
    <header
      className={clsx(
        'surface',
        'w-full px-6 h-16',
        'relative z-20',
        'flex justify-between items-center',
        'dark:border-b',
        isShown ? 'translate-y-0' : '-translate-y-full',
        'transition-transform duration-300',
      )}
    >
      <Brand hyperlink={brandHyperlink} />
      <div className="flex items-center">
        <ThemeSelection />
        {loginShown && (
          <>
            <Link
              to="/login"
              className={clsx(
                'px-3 py-1 ml-6',
                'font-semibold',
                'bg-primary dark:bg-dark-primary',
                'text-on-primary dark:text-on-dark-primary',
                'rounded-md',
                'hover:opacity-70 transition-opacity duration-300',
              )}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={clsx(
                'px-2 py-1 ml-2',
                'font-semibold',
                'text-primary dark:text-dark-primary',
                'hover:opacity-70 transition-opacity duration-300',
              )}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

type BrandProps = {
  hyperlink?: boolean;
};

function Brand({ hyperlink }: BrandProps) {
  const Content = () => (
    <>
      <img src={logoURL} className="size-10" alt="logo" />
      <span
        className={clsx(
          'ml-3',
          'font-bold text-2xl',
          'text-primary dark:text-dark-primary',
        )}
      >
        bygram
      </span>
    </>
  )

  if (!hyperlink) return <div className={clsx('flex items-center', 'w-fit')}><Content /></div>;
  return (
    <Link to="/" className={clsx('flex items-center', 'w-fit')}>
      <Content />
    </Link>
  );
}
