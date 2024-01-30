import React from 'react';

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  titleButton?: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
}

export const Card = (props: CardProps) => {
  return (
    <div className={"flex flex-col bg-lightNobleBlack gap-5 p-5 rounded-xl " + props.className}>
      {props.title &&
        <div className='flex gap-3 items-center'>
          <h1 className="text-2xl font-semibold ">{props.title}</h1>
          {props.titleButton && <props.titleButton /> }
        </div>
      }
      <div>
        {props.children}
      </div>
    </div>
  );
};

