import type { HTMLProps, PropsWithChildren } from 'react';

export type ReactProps = PropsWithChildren<{
  readonly className?: HTMLProps<HTMLElement>['className'] | string;
  readonly zIndex?: number;
  readonly onClick?: (e: React.MouseEvent) => void;
  readonly onExit?: () => void;
}>;
