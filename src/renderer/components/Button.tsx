import React from "react";

interface ButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}

export const Button = (props: ButtonProps) => {
    return (
        <button className={"rounded-md px-2 border-nobleGold text-nobleGold hover:bg-nobleGold hover:text-lightNobleBlack " + props.className} onClick={props.onClick}>
            {props.children}
        </button>
    );
}