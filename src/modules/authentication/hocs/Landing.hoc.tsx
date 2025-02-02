import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ClassNameProvider } from '../providers';
import { LandingLayout } from '../layouts';

export type OutletContextProps = {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export default function Landing() {
  const [title, setTitle] = useState('');

  return (
    <ClassNameProvider>
      <LandingLayout title={title}>
        <Outlet context={{ setTitle }} />
      </LandingLayout>
    </ClassNameProvider>
  );
}
