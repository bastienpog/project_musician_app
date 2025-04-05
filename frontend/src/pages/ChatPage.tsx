import React from "react";
import { Chat } from "@/components/Chat";
export const ChatPage: React.FC = () => {
    return (
        <>
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-600 to-purple-700">
                <Chat />
            </main>
        </>
    );
};