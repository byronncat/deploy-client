import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import type { MediaInfo, UploadedFile } from '../types';

const FilesContext = createContext(
  {} as {
    files: UploadedFile[] | MediaInfo[];
    setFile: React.Dispatch<React.SetStateAction<UploadedFile[] | MediaInfo[]>>;
    addFile: (
      files: UploadedFile | UploadedFile[] | MediaInfo | MediaInfo[],
    ) => void;
    removeFile: (id: UploadedFile['id'], index: number) => void;
    currentIndex: number;
    navigateIndex: (index: number) => void;
    isEmpty: () => boolean;
  },
);

interface FilesProviderProps extends PropsWithChildren {
  initialFiles?: UploadedFile[] | MediaInfo[];
}

export default function Files({
  children,
  initialFiles = [],
}: FilesProviderProps) {
  const [files, updateFiles] = useState<UploadedFile[]>(initialFiles);
  const [currentIndex, setCurrentIndex] = useState(0);

  function navigateIndex(index: number) {
    const _index =
      index >= files.length ? 0 : index < 0 ? files.length - 1 : index;
    setCurrentIndex(_index);
  }

  const addFile = useCallback(
    (files: UploadedFile | UploadedFile[] | MediaInfo | MediaInfo[]) => {
      if (Array.isArray(files)) {
        updateFiles((prev) => [...prev, ...files]);
      } else {
        updateFiles((prev) => [...prev, files]);
      }
    },
    [],
  );

  function removeFile(id: UploadedFile['id']) {
    let removeIndex = -1;
    const filteredFiles = files.filter((file) => {
      if (file.id === id) {
        removeIndex = files.indexOf(file);
        return false;
      }
      return true;
    });
    if (removeIndex <= currentIndex && currentIndex !== 0) {
      navigateIndex(currentIndex - 1);
    }
    updateFiles(filteredFiles);
  }

  function isEmpty() {
    return files.length === 0;
  }

  return (
    <FilesContext.Provider
      value={{
        files,
        setFile: updateFiles,
        addFile,
        removeFile,
        currentIndex,
        navigateIndex,
        isEmpty,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}

export const useFilesContext = () => useContext(FilesContext);
