import React from "react";
import { Register } from "@/components/Register";
export const RegisterPage: React.FC = () => {
    return (
        <>
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-600 to-purple-700">
                <Register />
            </main>
        </>
    );
};