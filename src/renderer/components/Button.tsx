import React from "react";

interface ButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    fill?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export const Button = (props: ButtonProps) => {
    return (
        <button disabled={props.disabled} type={props.type? props.type : "button"} className={"hover:brightness-110 transition-transform duration-100 hover:scale-105 rounded-full px-2 " +( props.fill ? "border-nobleGold text-lightNobleBlack bg-nobleGold hover:bg-nobleGold ": "border-nobleGold text-nobleGold hover:bg-nobleGold hover:text-lightNobleBlack ") + props.className} onClick={props.onClick}>
            {props.children}
        </button>
    );
}