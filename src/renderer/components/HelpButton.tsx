import { HelpCircle } from "lucide-react";
import React from "react";

interface LearnMoreProps {
    message: string;
    buttonClassName?: string;
    tooltipClassName?: string;
}

export const HelpButton = ({ buttonClassName, tooltipClassName, message }: LearnMoreProps) => {
    return (
        <div className="group relative  flex justify-center">
            <button className={`rounded  text-nobleGold ${buttonClassName}`}><HelpCircle /></button>
            <span className={`absolute top-7 scale-0 z-50 rounded bg-nobleBlack p-2 text-xs group-hover:scale-100 text-wrap text-justify ${tooltipClassName}`}>{message}</span>
        </div>
    );
}