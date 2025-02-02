import { createContext } from 'react';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

const className = {
  form: clsx('max-w-full w-100 p-10 pb-8', 'rounded-lg shadow-xl', 'surface'),
  formField: 'relative my-3',
  formInput: clsx(
    'block w-full px-3 pt-5 pb-2',
    'bg-on-surface/[0.04] dark:bg-dark-on-surface/[0.07]',
    'border-0 border-b-2 border-transparent',
    'rounded appearance-none',
    'text-on-surface/[0.6] dark:text-dark-on-surface/[0.6]',
    'transition duration-300',
    'focus:border-primary focus:outline-none focus:ring-0 peer',
    'focus:text-on-surface/[0.9] dark:focus:text-dark-on-surface',
    'dark:focus:border-dark-primary',
  ),
  formLabel: clsx(
    'absolute start-3 top-4 z-10',
    'text-on-surface/[0.6] dark:text-dark-on-surface/[0.6]',
    'duration-300 -translate-y-4 scale-75 origin-[0]',
    'peer-focus:text-on-surface dark:peer-focus:text-dark-on-surface',
    'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4',
  ),
  formErrorMessage: clsx(
    '-mt-2 mb-3',
    'font-medium text-sm',
    'text-error dark:text-dark-error',
  ),
  formErrorMessageAnimation: 'flicker-once',
};

export const ClassNameContext = createContext(
  {} as { className: Record<string, string> },
);

export default function ClassName({ children }: PropsWithChildren) {
  return (
    <ClassNameContext.Provider value={{ className }}>
      {children}
    </ClassNameContext.Provider>
  );
}
