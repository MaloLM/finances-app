import React from "react";

interface ButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    filled?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export const Button = (props: ButtonProps) => {
    return (
        <button disabled={props.disabled}
            type={props.type ? props.type : "button"}
            className={` rounded-full px-2 border
        ${props.filled
                    ? "border-nobleGold text-lightNobleBlack bg-nobleGold hover:bg-nobleGold hover:brightness-110 transition-transform duration-700 hover:scale-105 "
                    : ` border-nobleGold text-nobleGold  
                    relative flex transition-all items-center justify-center overflow-hidden before:absolute before:h-0 before:w-0 before:rounded-full before:bg-nobleGold before:duration-700 before:ease-in 
                    hover:before:h-96 hover:before:w-96 hover:text-lightNobleBlack hover:bg-lightNobleBlack`} 
                    ${props.className}`}
            onClick={props.onClick}>
            <div className="flex items-center justify-center z-30">
                {props.children}
            </div>
        </button>
    );
}