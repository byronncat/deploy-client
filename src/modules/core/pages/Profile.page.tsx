import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToggle } from 'usehooks-ts';
import clsx from 'clsx';

import { toast, Loader, Overlay, id } from '@global';
import { AuthContext } from '@authentication';
import { profileApi, postApi } from '../api';
import { Avatar } from '../components';
import { GridPostLayout } from '../layouts';
import type { ProfileData, UploadedFile } from '../types';
import { LayoutContext } from '../layouts/Dashboard.layout';
import { CloudinaryContext } from '../providers/Cloudinary.provider';
import { AVATAR_MENU } from '../constants';
import Menu from '../components/Menu.component';
import { PostContext } from '../providers';

export default function ProfilePage() {
  const [isLoaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { setPosts } = useContext(PostContext);

  const { user } = useContext(AuthContext);
  const { register, handleSubmit } = useForm<{ file: FileList }>();

  const [showAvatarMenu, toggleAvatarMenu] = useToggle();

  function isFollowing() {
    return user && profile?.followers.includes(user.id);
  }

  async function followHandler() {
    if (!profile) return;
    const response = await profileApi.follow(profile.id);
    if (response.success)
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: [...prev.followers, user!.id],
        };
      });
    else toast.error(response.message);
  }

  async function unfollowHandler() {
    if (!profile) return;
    const response = await profileApi.unfollow(profile.id);
    if (response.success)
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: prev.followers.filter((id) => id !== user!.id),
        };
      });
    else toast.error(response.message);
  }

  const page = useRef(0);
  const { username } = useParams();
  const fetchPosts = useCallback(async () => {
    if (!username || isFetching.current) return;
    isFetching.current = true;
    const response = await postApi.getPostsByUsername(username, page.current);
    if (response.success && response.data) {
      setPosts((prev) => [...(prev || []), ...response.data]);
      page.current += 1;
    }
    isFetching.current = false;
  }, [username, setPosts]);

  const isFetching = useRef(false);
  const fetchProfile = useCallback(async () => {
    if (!username || isFetching.current) return;
    isFetching.current = true;
    const response = await profileApi.getProfile(username);
    if (response.success && response.data) {
      setProfile(response.data);
    } else toast.error(response.message);
    setLoaded(true);
    isFetching.current = false;
    await fetchPosts();
  }, [username, fetchPosts]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    setPosts([]);
    setProfile(null);
    page.current = 0;
    fetchProfile();
  }, [username, fetchProfile, setPosts]);

  const { uploadFile } = useContext(CloudinaryContext);
  const inpurRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register('file', {
    onChange: () => {
      handleSubmit(changeAvatarHandler)();
    },
    required: true,
  });
  const changeAvatarHandler: SubmitHandler<{ file: FileList }> = async (
    data,
  ) => {
    if (showAvatarMenu) toggleAvatarMenu();
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = document.createElement('img');
      img.src = event.target!.result as string;
      img.onload = async () => {
        const orientation =
          img.width > img.height
            ? 'landscape'
            : img.width < img.height
            ? 'portrait'
            : 'square';
        const file = {
          id: id.generate(),
          url: img.src,
          orientation,
          type: data.file[0].type,
        } as UploadedFile;

        toast.loading('Uploading...');
        const uploadedFile = await uploadFile(file, {
          asset_folder: user!.username,
          public_id_prefix: user!.username,
        });

        const response = await profileApi.changeAvatar(uploadedFile);
        if (response.success)
          setProfile(
            (prev) =>
              prev && ({ ...prev, avatar: uploadedFile } as ProfileData),
          );
        toast[response.success ? 'success' : 'error'](response.message);
      };
    };
    reader.readAsDataURL(data.file[0]);
  };
  const removeAvatarHandler = async () => {
    toggleAvatarMenu();
    toast.loading('Removing...');
    const response = await profileApi.removeAvatar();
    if (response.success) {
      const removedAvatar = profile;
      if (removedAvatar) delete removedAvatar.avatar;
      setProfile(removedAvatar);
    }
    toast[response.success ? 'success' : 'error'](response.message);
  };

  const { scrollRef } = useContext(LayoutContext);
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        fetchPosts();
      }
    }
  }, [fetchPosts, scrollRef]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      if (scrollElement)
        scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, scrollRef]);

  if (!isLoaded) return <Loader.BoxSpin />;
  return (
    <>
      {/* {showCurrentPost && (
        <PostWindow
          post={currentPost}
          onExit={() => setShowCurrentPost(false)}
        />
      )} */}
      
      {showAvatarMenu && (
        <Overlay onExit={toggleAvatarMenu}>
          <Menu
            title="Change Profile Photo"
            list={AVATAR_MENU.map((item) => {
              if (item.name === 'Cancel') {
                return {
                  ...item,
                  functionHandler: toggleAvatarMenu,
                };
              }
              if (item.name === 'Upload Photo') {
                return {
                  ...item,
                  functionHandler: () => inpurRef.current?.click(),
                };
              }
              if (item.name === 'Remove Current Photo') {
                return {
                  ...item,
                  functionHandler: removeAvatarHandler,
                };
              }
              return item;
            })}
          />
        </Overlay>
      )}
      <div
        className={clsx(
          'w-full max-w-screen-lg min-h-[calc(100vh-8rem)]',
          'px-4 py-8',
        )}
      >
        <header
          className={clsx(
            'flex',
            'pb-6 mb-7',
            'gap-x-8 md:gap-x-12',
            'border-b border-on-background/[.12] dark:border-dark-on-background/[.2]',
          )}
        >
          <form
            className={clsx(
              'relative',
              'rounded-full overflow-hidden',
              'flex justify-center items-center',
              'hover:opacity-80 transition-opacity duration-300',
            )}
          >
            <Avatar size={'medium'} image={profile?.avatar} />
            {profile && user?.id === profile?.id && (
              <input
                type="file"
                className={clsx(
                  'opacity-0',
                  'absolute top-0 left-0',
                  profile?.avatar?.url ? 'hidden' : 'size-full',
                )}
                {...rest}
                name="file"
                ref={(e) => {
                  ref(e);
                  inpurRef.current = e;
                }}
              />
            )}
            <div
              className={clsx(
                'opacity-0 cursor-pointer',
                'absolute top-0 left-0',
                profile?.avatar?.url ? 'size-full' : 'hidden',
              )}
              onClick={toggleAvatarMenu}
            />
          </form>

          <div className={clsx('flex flex-col', 'gap-y-3 md:gap-y-4')}>
            <div className={clsx('flex items-center', 'gap-x-6')}>
              <h2 className="text-2xl font-semibold">{profile?.username}</h2>
              {profile && user?.id !== profile?.id && (
                <button
                  className={clsx(
                    'px-3 md:px-2 py-1',
                    'text-lg',
                    'simple-border-button',
                  )}
                  onClick={isFollowing() ? unfollowHandler : followHandler}
                >
                  {isFollowing() ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>

            <ul
              className={clsx(
                'p-0',
                'list-unstyled opacity-60',
                'flex flex-col md:flex-row space-x-0 md:space-x-4',
              )}
            >
              <li>
                <span className="pr-1">{profile?.totalPosts}</span>
                Posts
              </li>
              <li>
                <span className="pr-1">{profile?.followers.length}</span>
                Followers
              </li>
              <li>
                <span className="pr-1">{profile?.followings.length}</span>
                Following
              </li>
            </ul>

            {profile?.description && (
              <p className="text-sm text-white/[0.62]">
                {profile?.description}
              </p>
            )}
          </div>
        </header>
        <GridPostLayout />
      </div>
    </>
  );
}
