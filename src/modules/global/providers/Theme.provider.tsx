import {
  createContext,
  useContext,
  useLayoutEffect,
  type PropsWithChildren,
} from 'react';
import { useTernaryDarkMode } from 'usehooks-ts';
import { LocalStorageKey } from '../constants';

type TernaryDarkMode = ReturnType<typeof useTernaryDarkMode>['ternaryDarkMode'];
const ThemeContext = createContext(
  {} as {
    theme: TernaryDarkMode;
    setTheme: (theme: TernaryDarkMode) => void;
    setLightTheme: () => void;
    setDarkTheme: () => void;
    setSystemTheme: () => void;
    isDarkMode: boolean;
  },
);

export default function ThemeProvider({ children }: PropsWithChildren) {
  const { isDarkMode, ternaryDarkMode, setTernaryDarkMode } =
    useTernaryDarkMode({
      defaultValue: 'light' as TernaryDarkMode,
      localStorageKey: LocalStorageKey.Theme,
    });

  useLayoutEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.className = theme;
    document.getElementById('root')!.className = `css-${theme}-theme`;
    document.body.className =
      theme === 'light' ? 'bg-surface' : 'bg-dark-surface';
  }, [isDarkMode]);

  function setLightTheme() {
    setTernaryDarkMode('light' as TernaryDarkMode);
  }
  function setDarkTheme() {
    setTernaryDarkMode('dark' as TernaryDarkMode);
  }
  function setSystemTheme() {
    setTernaryDarkMode('system' as TernaryDarkMode);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: ternaryDarkMode,
        setTheme: setTernaryDarkMode,
        setLightTheme,
        setDarkTheme,
        setSystemTheme,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
