import { ChangeEvent, useContext, useLayoutEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useWindowSize } from 'usehooks-ts';
import clsx from 'clsx';

import { id, toast, Overlay, Loader } from '@global';
import { AuthContext } from '@authentication';
import { postApi } from '../../../api';
import {
  FilesProvider,
  useFilesContext,
  PostContext,
} from '../../../providers';
import { CloudinaryContext } from '../../../providers/Cloudinary.provider';
import FileUploadArea from './FileUploadArea.component';

import type {
  UploadedFile,
  PostUploadData,
  PostDisplayData,
} from '../../../types';
import type { ReactProps } from '@global';
import { CircleXMarkIcon } from '@/assets/icons';

interface UploadPostWindowProps extends ReactProps {
  onExit: () => void;
  method: 'post' | 'put';
  defaultPost?: Pick<PostUploadData, 'content' | 'files'> &
    Pick<PostDisplayData, 'id'>;
}

function UploadPostWindow({
  onExit,
  method,
  defaultPost,
}: UploadPostWindowProps) {
  const [isLoading, setLoading] = useState(false);
  const { files, addFile, setFile, isEmpty } = useFilesContext();
  const { updateCurrentPost } = useContext(PostContext);

  useLayoutEffect(() => {
    if (defaultPost) {
      setFile(defaultPost.files);
    }
  }, [setFile, defaultPost]);

  const fileUploadHandler = (files: FileList) => {
    if (files.length === 0) return;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileType = file.type.split('/')[0];
        if (fileType === 'image') {
          const img = new Image();
          img.src = event.target!.result as string;
          img.onload = () => {
            const orientation =
              img.width > img.height
                ? 'landscape'
                : img.width < img.height
                ? 'portrait'
                : 'square';
            addFile({
              id: id.generate(),
              url: img.src,
              orientation,
              type: file.type,
            } as UploadedFile);
          };
        } else if (fileType === 'video') {
          const video = document.createElement('video');
          video.src = event.target!.result as string;
          video.onloadedmetadata = () => {
            const orientation =
              video.videoWidth > video.videoHeight
                ? 'landscape'
                : video.videoWidth < video.videoHeight
                ? 'portrait'
                : 'square';
            addFile({
              id: id.generate(),
              url: video.src,
              orientation,
              type: file.type,
            } as UploadedFile);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { user } = useContext(AuthContext);
  const { register, handleSubmit } = useForm({ defaultValues: defaultPost });
  const { uploadFiles } = useContext(CloudinaryContext);
  const submitForm: SubmitHandler<Pick<PostUploadData, 'content'>> = async (
    data,
  ) => {
    setLoading(true);
    const postData: PostUploadData = {
      id: defaultPost?.id || undefined,
      content: data.content,
      files: await uploadFiles(files, {
        asset_folder: user!.username,
        public_id_prefix: user!.username,
      }),
    };
    const response =
      method === 'post'
        ? await postApi.uploadPost(postData, method)
        : await postApi.uploadPost(postData, method);
    setLoading(false);
    if (response.success) {
      onExit();
      toast.success(response.message);
      if (method === 'put') updateCurrentPost({ content: data.content });
    } else {
      console.error(response.message);
    }
  };

  return (
    <div
      className={clsx(
        'surface',
        'pt-16 md:pt-0',
        'max-w-screen min-w-fit w-full md:w-auto h-full md:h-[50vw] md:max-h-[92vh]',
        'md:rounded-xl',
        'overflow-y-scroll md:overflow-hidden no-scrollbar',
        'aspect-auto',
        (isEmpty() || isLoading) && 'md:aspect-square',
      )}
    >
      <div
        className={clsx(
          'surface',
          'h-16 md:h-12',
          'flex justify-center items-center',
          'absolute top-0 left-0 right-0 z-10 md:static',
          'border-b border-on-surface/[.2] dark:border-dark-on-surface/[.2]',
        )}
      >
        <span
          className={clsx(
            'font-semibold text-center capitalize',
            'text-on-surface dark:text-dark-on-surface/[0.87]',
          )}
        >
          {method === 'post' ? 'create new post' : 'edit post'}
        </span>
        <button
          onClick={onExit}
          className={clsx(
            'md:hidden',
            'absolute right-0',
            'mr-3',
            'hover:opacity-70 transition-opacity duration-300',
          )}
        >
          <CircleXMarkIcon
            className={clsx(
              'size-8',
              'fill-on-surface/[.7] dark:fill-dark-on-surface/[.7]',
            )}
          />
        </button>
      </div>
      <form
        className={clsx(
          'flex flex-col md:flex-row grow',
          'md:h-[calc(100%-3rem)] h-full',
        )}
        onSubmit={handleSubmit(submitForm)}
      >
        {/* Drop zone */}
        <div className={clsx('relative size-full')}>
          <div className="size-full aspect-square">
            {isLoading ? (
              <div
                className={clsx(
                  'flex justify-center items-center gap-x-3',
                  'size-full',
                )}
              >
                <Loader.Regular />
                <span
                  className={clsx(
                    'text-xl font-medium',
                    'text-on-surface dark:text-dark-on-surface',
                  )}
                >
                  Loading
                </span>
              </div>
            ) : (
              <FileUploadArea fileUploadHandler={fileUploadHandler} />
            )}
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.files) fileUploadHandler(event.target.files);
                (function resetValue() {
                  event.target.value = '';
                })();
              }}
            />
          </div>
        </div>

        {/* Content */}
        {!isEmpty() && !isLoading && (
          <div
            className={clsx(
              'md:aspect-9/16 h-full',
              'flex flex-col',
              'overflow-hidden',
            )}
          >
            <textarea
              className={clsx(
                'w-full h-2/5 px-3 py-4 min-h-40',
                'outline-none resize-none',
                'text-on-surface dark:text-dark-on-surface',
                'shadow-sm dark:shadow-none',
                'dark:border-dark-surface/[0.2] dark:border-b',
                'bg-on-surface/[0.04] dark:bg-dark-on-surface/[0.07]',
              )}
              placeholder="What's on your mind?"
              rows={3}
              {...register('content')}
            />
            <button
              type="submit"
              className={clsx(
                'self-end',
                'simple-border-button',
                'w-fit px-3 py-2 my-4 mr-4',
              )}
            >
              Share
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function UploadPostWindowWrapper(props: UploadPostWindowProps) {
  const { width = 0 } = useWindowSize();
  return (
    <FilesProvider>
      <Overlay onExit={props.onExit} closeButtonShown={width >= 768}>
        <UploadPostWindow {...props} />
      </Overlay>
    </FilesProvider>
  );
}

export default UploadPostWindowWrapper;
