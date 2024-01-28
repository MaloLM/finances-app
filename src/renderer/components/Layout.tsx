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
            mt-14
            md:mt-10 md:mx-20
            lg:mt-10 lg:mx-40
            xl:mt-10 xl:mx-60 ">
        {props.children}
      </main>
    </div>
  );
};

