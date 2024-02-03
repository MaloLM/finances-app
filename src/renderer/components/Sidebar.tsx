import React, { useState } from "react";
import { SidebarButtonIcon, StatsIcon, BoxesIcon } from "../assets";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const navigateToPath = (path) => {
        setSidebarOpen(false);
        navigate(path);
    };

    return (
        <>
            <button onClick={toggleSidebar} aria-controls="default-sidebar" type="button"
                className={`fixed top-2 z-50 transition-transform duration-500 inline-flex items-center p-2 mt-2 
            bg-nobleBlack text-sm text-gray-500  hover:bg-lightNobleBlack hover:border-nobleGold focus:outline-none  border-lightNobleBlack
            ${isSidebarOpen ? "translate-x-64 xl:translate-x-72 rounded-r-lg rounded-l-none border-l-0" : "ms-3 rounded-lg "} `}
            >
                <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
                <SidebarButtonIcon className={isSidebarOpen ? '' : "text-nobleGold"} />
            </button>
            <aside id="default-sidebar" className={`fixed top-0 left-0 z-40 w-64 xl:w-72 h-screen transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} `} aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-nobleBlack  border-r border-lightNobleBlack">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a onClick={() => navigateToPath("/tam")} className="flex cursor-pointer items-center p-2 text-gray-300 hover:text-nobleGold rounded-lg dark:text-white hover:bg-lightNobleBlack group">
                                <StatsIcon />
                                <span className="ms-3">Target Allocation Maintenance</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => navigateToPath("/other-feature")} className="flex cursor-pointer items-center p-2 text-gray-300 hover:text-nobleGold rounded-lg dark:text-white hover:bg-lightNobleBlack  group">
                                <BoxesIcon className="hover:text-cyan-100" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Other Feature</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};
