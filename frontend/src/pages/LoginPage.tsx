import React from "react";
import { Login } from "@/components/Login";
export const LoginPage: React.FC = () => {
    return (
        <>
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-600 to-purple-700">
                <Login />
            </main>
        </>
    );
};