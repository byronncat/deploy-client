import { useEffect, useRef, useState } from 'react';
import { useToggle } from 'usehooks-ts';
import clsx from 'clsx';

import { useFilesContext } from '../../../providers';
import Carousel from '../Carousel.component';
import {
  PhotoFilmIcon,
  CloneIcon,
  PlusIcon,
  CircleXMarkIcon,
} from '@assets/icons';
import type { DragEvent, MouseEventHandler } from 'react';
import type { UploadedFile } from '../../../types';

interface FileUploadAreaProps {
  fileUploadHandler: (files: FileList) => void;
}

export default function FileUploadArea({
  fileUploadHandler,
}: FileUploadAreaProps) {
  const [isDrag, setIsDrag] = useState(false);
  const [miniShow, toggleMiniShow] = useToggle(false);
  const { isEmpty } = useFilesContext();

  function dragOverHandler(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDrag(true);
  }

  function dragLeaveHandler() {
    setIsDrag(false);
  }

  function dropHandler(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) fileUploadHandler(files);
    setIsDrag(false);
  }

  return isEmpty() ? (
    <div
      className={clsx(
        'relative',
        'size-full',
        'flex items-center justify-center',
      )}
    >
      <label
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        onDrop={dropHandler}
        htmlFor="dropzone-file"
        className={clsx(
          'absolute top-0 start-0',
          'flex flex-col items-center justify-center',
          'size-full',
          'cursor-pointer ',
          'hover:bg-on-background/[.12] dark:hover:bg-dark-on-background/[.05]',
          'transition-colors duration-200',
          isDrag && 'bg-on-background/[.12] dark:bg-dark-on-background/[.05]',
        )}
      />
      <DragZone />
    </div>
  ) : (
    <>
      <Carousel />
      <div
        className={clsx(
          'absolute bottom-0 right-0 z-20',
          'w-full p-3',
          'flex flex-col items-end',
        )}
      >
        {miniShow && <MiniNavigator />}
        <button
          type="button"
          className={clsx(
            'p-3 w-fit',
            'rounded-full primary',
            'cursor-pointer hover:opacity-70',
            'transition-opacity duration-200',
          )}
          onClick={toggleMiniShow}
        >
          <CloneIcon className={clsx('size-5', 'fill-on-primary')} />
        </button>
      </div>
    </>
  );
}

function DragZone() {
  return (
    <div
      className={clsx('flex flex-col items-center justify-center', 'pt-5 pb-6')}
    >
      <PhotoFilmIcon
        className={clsx(
          'size-16',
          'fill-on-background/[.4] dark:fill-dark-on-background/[.4]',
        )}
      />
      <p
        className={clsx(
          'mt-5',
          'text-center text-on-background/[.4] dark:text-dark-on-background/[.4]',
        )}
      >
        <span className="font-semibold">Drag photos and videos here</span>
        <br />
        or click to upload
      </p>
    </div>
  );
}

function MiniNavigator() {
  const { files, removeFile, currentIndex, navigateIndex } = useFilesContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const propagationHandler: MouseEventHandler<
    HTMLDivElement | HTMLButtonElement
  > = (event) => {
    event.stopPropagation();
  };

  const scrollHandler = (event: WheelEvent) => {
    event.preventDefault();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', scrollHandler);
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', scrollHandler);
      }
    };
  }, []);

  return (
    <div
      className={clsx(
        'flex gap-x-2 items-center',
        'max-w-full w-fit h-28 p-2 my-3',
        'bg-on-background/[0.6]',
        'rounded-md',
      )}
      onClick={propagationHandler}
    >
      <div
        className={clsx(
          'h-full',
          'overflow-x-auto no-scrollbar',
          'flex items-center gap-x-2',
        )}
        ref={scrollContainerRef}
      >
        {files.map((file: UploadedFile, index) => (
          <div
            key={file.id}
            className={clsx(
              'relative',
              'size-24 min-w-24',
              'cursor-pointer overflow-hidden',
              'transition-opacity duration-200',
              index === currentIndex
                ? 'opacity-100'
                : 'opacity-60 hover:opacity-90',
            )}
            onClick={() => navigateIndex(index)}
          >
            {file.type.startsWith('image') ? (
              <img
                src={file.url}
                alt="uploaded file"
                className={clsx('size-full object-cover', 'rounded-md')}
              />
            ) : (
              <video
                src={file.url}
                className={clsx('size-full object-cover', 'rounded-md')}
              />
            )}
            <button
              className={clsx(
                'block',
                'size-5 m-1',
                'absolute top-0 right-0',
                'cursor-pointer hover:opacity-60',
                'transition-opacity duration-200',
              )}
              onClick={(e) => {
                propagationHandler(e);
                removeFile(file.id, index);
              }}
            >
              <CircleXMarkIcon
                className={clsx(
                  'size-full',
                  'fill-primary/[.87] dark:fill-dark-primary/[.87]',
                )}
              />
            </button>
          </div>
        ))}
      </div>
      <label
        htmlFor="dropzone-file"
        className={clsx(
          'p-2 h-fit',
          'primary rounded-full',
          'cursor-pointer hover:opacity-70',
          'transition-opacity duration-200',
        )}
      >
        <PlusIcon className={clsx('size-5', 'fill-on-primary')} />
      </label>
    </div>
  );
}
