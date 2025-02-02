import type { MenuItem } from '../types';

export const AUTHOR_POST_MENU: MenuItem[] = [
  {
    name: 'Delete post',
    fontWeight: 'bold',
    color: 'red',
  },
  {
    name: 'Edit post',
  },
  {
    name: 'Cancel',
  },
];

export const VIEWER_POST_MENU: MenuItem[] = [
  {
    name: 'Unfollow',
    fontWeight: 'bold',
    color: 'red',
  },
  {
    name: 'Go to post',
  },
  {
    name: 'Go to profile',
  },
  // {
  //   name: 'About this account',
  // },
  {
    name: 'Cancel',
  },
];

export const FOLLOWP_POST_MENU: MenuItem[] = [
  {
    name: 'Go to post',
  },
  {
    name: 'About this account',
  },
];

export const AVATAR_MENU: MenuItem[] = [
  {
    name: 'Upload Photo',
    fontWeight: 'bold',
    color: 'blue',
  },
  {
    name: 'Remove Current Photo',
    fontWeight: 'bold',
    color: 'red',
  },
  {
    name: 'Cancel',
  },
];
