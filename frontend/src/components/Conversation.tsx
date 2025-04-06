import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Conversation structure expected from the backend
type Conversation = {
    ConversationId: number;
    SenderId: number;
    RecipientId: number;
    sender_username: string;
    recipient_username: string;
};

export const Conversations: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
    const navigate = useNavigate();

    // Fetch conversations from the server
    useEffect(() => {
        const fetchConversations = async () => {
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found in localStorage");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/conversations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch conversations");
                }

                const data = await response.json();
                setConversations(data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, [userId]);

    // Helper to get the other participant's username
    const getOtherUserName = (conversation: Conversation) => {
        return conversation.SenderId.toString() === userId
            ? conversation.recipient_username
            : conversation.sender_username;
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-black/20 border-white/20 text-white pt-6">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold">Messages</h2>
            </div>

            {/* Conversation List Scroll Area */}
            <ScrollArea className="h-[600px]">
                <div className="divide-y divide-white/10">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.ConversationId}
                            className="flex items-center justify-between gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => navigate(`/chat/${conversation.ConversationId}`)}
                        >
                            <span className="text-xl">{getOtherUserName(conversation)}</span>
                            <Send />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
};
