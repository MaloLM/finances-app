import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = (props: LayoutProps) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="
            min-w-fit
            sm:min-w-0
            mt-10
            lg:mt-10 lg:mx-20
            xl:mt-10 xl:mx-40 ">
        {props.children}
      </main>
    </div>
  );
};

