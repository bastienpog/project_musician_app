import React from "react";
import { Conversations } from "@/components/Conversation";
export const ConversationPage: React.FC = () => {
    return (
        <>
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-600 to-purple-700">
                <Conversations />
            </main>
        </>
    );
};