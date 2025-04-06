import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Guitar } from "lucide-react";

export const Header: React.FC = () => {
    const location = useLocation();

    // Check if the current path is active
    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <header className="sticky w-full border-t md:border-b md:border-t-0 border-black/20 shadow-sm z-50 md:top-0 bottom-0 md:bottom-auto bg-black/20 backdrop-blur">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-violet-600 pr-3">Musica</h1>
                    <Guitar className="text-violet-600" size={32} />
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    <Link
                        to="/home"
                        className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 text-sm transition-colors duration-200 ${isActive("/home")
                                ? "text-violet-600 font-semibold"
                                : "text-white hover:text-gray-400"
                            }`}
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/conv"
                        className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 text-sm transition-colors duration-200 ${isActive("/conv")
                                ? "text-violet-600 font-semibold"
                                : "text-white hover:text-gray-400"
                            }`}
                    >
                        <MessageSquare size={20} />
                        <span>Conversations</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};
