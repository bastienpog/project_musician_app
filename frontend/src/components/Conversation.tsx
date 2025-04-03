import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';

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

    const getOtherUserName = (conversation: Conversation) => {
        if (conversation.SenderId.toString() === userId) {
            return conversation.recipient_username;
        } else {
            return conversation.sender_username;
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl border-white/20 text-white">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <ScrollArea className="h-[600px]">
                <div className="divide-y divide-white/10">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.ConversationId}
                            className="flex items-center justify-between gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer"
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
