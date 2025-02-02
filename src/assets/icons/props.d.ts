import type { ReactProps } from '@global';

export type IconProps = {
  size?: number;
  color?: string;
  type?: IconTypes;
} & ReactProps;

export type IconTypes = 'regular' | 'solid';
