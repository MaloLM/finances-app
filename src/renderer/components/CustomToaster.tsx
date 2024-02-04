import React from "react";
import { Toaster } from 'react-hot-toast';


export const CustomToaster = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 5000, // Infinity
                className: 'bg-lightNobleBlack border border-nobleGold text-softWhite',
            }}
        />
    );
}