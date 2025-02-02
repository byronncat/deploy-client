export interface MenuItem {
  readonly name: string;
  readonly color?: 'red' | 'blue';
  readonly fontWeight?: 'bold' | 'normal';
  functionHandler?: (...args: any) => any;
}
