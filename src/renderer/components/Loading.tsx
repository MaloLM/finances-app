import React from "react";

export const Loading = () => {
    return (
        <div className="flex items-center justify-center h-full relative">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nobleGold"></div>
            <h1 className="loading-text text-lg font-bold text-nobleGold absolute">Loading</h1>
        </div>
    );
}