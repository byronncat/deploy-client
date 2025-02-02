import {
  useState,
  useContext,
  createContext,
  type PropsWithChildren,
} from 'react';

const GlobalContext = createContext(
  {} as {
    loading: {
      start: () => void;
      end: () => void;
      state: boolean;
    };
  },
);

export default function GlobalState({ children }: PropsWithChildren) {
  const [loading, setIsLoading] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        loading: {
          start: () => setIsLoading(true),
          end: () => setIsLoading(false),
          state: loading,
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);
