import React from "react";
import { Conversations } from "@/components/Conversation";
import { Header } from "@/components/Header";
export const ConversationPage: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-pink-600 to-purple-700">
                <Header />
                <main className="p-6 flex items-center justify-center">
                    <Conversations />
                </main>
            </div>
        </>
    );
};