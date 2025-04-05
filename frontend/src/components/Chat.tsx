import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { ArrowLeft } from "lucide-react";

type Message = {
    id: string;
    content: string;
    timestamp: string;
    sender: "user" | "other";
    status: "sent" | "delivered" | "read";
};

const CURRENT_USER_ID = localStorage.getItem("userId");

export const Chat: React.FC = () => {
    const { conversationId } = useParams<{ conversationId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [otherUserName, setOtherUserName] = useState<string | null>(null);
    const navigate = useNavigate()
    useEffect(() => {
        if (!conversationId || !CURRENT_USER_ID) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:8000/messages/${conversationId}`);
                const data = await res.json();

                const formattedMessages: Message[] = data.map((msg: any) => ({
                    id: msg.MessageId.toString(),
                    content: msg.content,
                    timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    sender:
                        msg.SenderId.toString() === CURRENT_USER_ID ? "user" : "other",
                    status: "delivered",
                }));

                setMessages(formattedMessages);

                const otherUser =
                    data[0].SenderId.toString() === CURRENT_USER_ID
                        ? data[0].recipient_username
                        : data[0].sender_username;

                setOtherUserName(otherUser);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [conversationId]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            content: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sender: "user",
            status: "sent",
        };

        setMessages((prev) => [...prev, newMsg]);
        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Card className="w-full max-w-md h-[600px] mx-auto bg-black/20 border-white/20 text-white flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(`/conv`)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h2 className="font-semibold">{otherUserName || "Loading..."}</h2>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] ${message.sender === "user" ? "bg-pink-600" : "bg-white/10"
                                    } rounded-2xl px-4 py-2`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs text-white/60 mt-1">{message.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-white/10 border-white/10 text-white placeholder:text-white/60"
                    />
                    <Button onClick={handleSendMessage} className="bg-pink-600 hover:bg-pink-700">
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};
``
