import { createContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { ErrorPage, type ReactProps } from '@global';
import type { MediaInfo, UploadedFile } from '../types';

const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
(function validateCloudinaryConfig() {})();

type CloudinaryOptions = {
  asset_folder?: string;
  public_id_prefix?: string;
  use_asset_folder_as_public_id_prefix?: boolean;
};

export const CloudinaryContext = createContext(
  {} as {
    uploadFile: (
      file: UploadedFile,
      options?: CloudinaryOptions,
    ) => Promise<MediaInfo>;
    uploadFiles: (
      files: UploadedFile[],
      options?: CloudinaryOptions,
    ) => Promise<MediaInfo[]>;
    DefaultAvatar: () => JSX.Element;
  },
);

export default function CloudinaryProvider({ children }: ReactProps) {
  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary config is not set up properly');
    return <ErrorPage />;
  }

  const cld = new Cloudinary({
    cloud: {
      cloudName: cloudName,
    },
  });

  async function uploadFile(file: UploadedFile, options?: CloudinaryOptions) {
    const formData = new FormData();
    formData.append('file', file.url);
    formData.append('public_id', file.id);
    formData.append('upload_preset', uploadPreset!);

    if (options) {
      if (options.asset_folder)
        formData.append('asset_folder', options.asset_folder);
      if (options.public_id_prefix)
        formData.append('public_id_prefix', options.public_id_prefix);
    }

    const fileType = file.type.split('/')[0];
    return axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${fileType}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(function (response: AxiosResponse) {
        return {
          id: response.data.public_id,
          url: response.data.secure_url,
          type: fileType,
          orientation: file.orientation,
        } as MediaInfo;
      });
  }

  async function uploadFiles(
    files: UploadedFile[],
    options?: CloudinaryOptions,
  ) {
    const uploadPromises = files.map((f) => uploadFile(f, options));
    return await Promise.all(uploadPromises);
  }

  function DefaultAvatar() {
    return (
      <AdvancedImage
        cldImg={cld.image('default-avatar')}
        className="object-cover h-full"
      />
    );
  }

  return (
    <CloudinaryContext.Provider
      value={{
        uploadFile,
        uploadFiles,
        DefaultAvatar,
      }}
    >
      {children}
    </CloudinaryContext.Provider>
  );
}
