import React from 'react';

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  titleButton?: React.ReactNode;
}

export const Card = (props: CardProps) => {
  return (
    <div className={` flex flex-col bg-lightNobleBlack gap-5 p-9 rounded-xl ${props.className}   `}>
      {props.title &&
        <div className='flex gap-3 items-center'>
          <h1 className="text-3xl text-nobleGold  font-serif font-medium tracking-wider subpixel-antialiased ">{props.title}</h1>
          {props.titleButton && props.titleButton}
        </div>
      }
      <div className='font-light'>
        {props.children}
      </div>
    </div>
  );
};

