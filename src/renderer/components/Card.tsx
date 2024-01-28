import React from 'react';

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Card = (props: CardProps) => {
  return (
    <div className={"flex flex-col bg-lightNobleBlack gap-5 p-5 rounded-xl " + props.className}>
      {props.title && <h1 className="text-3xl font-serif">{props.title}</h1>}
      <div>
        {props.children}
      </div>
    </div>
  );
};

