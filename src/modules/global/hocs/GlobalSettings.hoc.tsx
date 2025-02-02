import '../styles/global.sass';
import 'react-toastify/dist/ReactToastify.css';
import { Toast } from '../components';
import { GlobalStateProvider, ThemeProvider } from '../providers';
import type { PropsWithChildren } from 'react';

export default function GlobalSettings({ children }: PropsWithChildren) {
  return (
    <GlobalStateProvider>
      <ThemeProvider>
        <Toast />
        {children}
      </ThemeProvider>
    </GlobalStateProvider>
  );
}
