import {
  toast as reactToastify,
  ToastContainer,
  type ToastContainerProps,
} from 'react-toastify';
import clsx from 'clsx';

const settings = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  draggable: true,
  pauseOnHover: true,
  closeButton: false,
  theme: 'colored',
} as ToastContainerProps;

const contextClass = {
  success: clsx(
    "before:content-['']",
    'before:absolute before:top-0 before:left-0 before:rounded-lg',
    'before:w-full before:h-full before:dark:bg-white/[.2]',
    "after:content-['']",
    'after:absolute after:top-0 after:left-0 after:rounded-lg after:-z-10',
    'after:w-full after:h-full after:bg-success',
  ),
  error: clsx(
    "before:content-['']",
    'before:absolute before:top-0 before:left-0 before:rounded-lg',
    'before:w-full before:h-full before:dark:bg-white/[.2]',
    "after:content-['']",
    'after:absolute after:top-0 after:left-0 after:rounded-lg after:-z-10',
    'after:w-full after:h-full after:bg-error',
  ),
  info: '',
  warning: '',
  dark: '',
  default: clsx(
    'bg-on-background/[.7] text-background',
    'dark:bg-dark-on-background/[.3] dark:text-on-dark-background',
  ),
};

export default function Toast() {
  return (
    <ToastContainer
      className="font-medium text-lg mt-1 z-[100]"
      {...settings}
      toastClassName={(context) =>
        clsx(
          contextClass[context?.type || 'default'],
          'relative',
          'p-2 mb-4 rounded-md',
          'flex justify-between',
          'overflow-hidden cursor-pointer',
        )
      }
    />
  );
}

function loading(message: string | undefined) {
  reactToastify.dismiss();
  reactToastify.loading(message || 'Loading...');
}
function success(message: string | undefined) {
  reactToastify.dismiss();
  reactToastify.success(message || 'Success');
}
function error(message: string | undefined) {
  reactToastify.dismiss();
  reactToastify.error(message || 'Error');
}

export const toast = { loading, success, error };
