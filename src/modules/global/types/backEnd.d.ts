export type API<DataType = undefined> = {
  readonly success: boolean;
  readonly message: string;
} & (DataType extends undefined ? {} : { readonly data: DataType });
