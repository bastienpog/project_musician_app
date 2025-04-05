import { useState, useEffect } from "react";
import { ProfileCard } from "@/components/Profile";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

type MediaItem = {
    id: string;
    type: "video" | "audio";
    title: string;
    subtitle: string;
    thumbnailUrl: string;
};

type UserMedia = {
    profile_picture: string;
    cover_image: string;
    items: MediaItem[];
};

type UserProfile = {
    id: number;
    username: string;
    email: string;
    info: string;
    gender: number;
    media: UserMedia;
};


const API_URL = "http://localhost:8000/users";

export const Home = () => {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const fetchProfiles = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch profiles");
            }
            const data = await response.json();
            setProfiles(data);
        };
        fetchProfiles();

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const itemsPerPage = isMobile ? 1 : 2;

    const nextProfiles = () => {
        if (currentIndex + itemsPerPage < profiles.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const prevProfiles = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-600 to-purple-700">
            <Header />
            <div className="p-4 flex flex-col items-center">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
                    {profiles.slice(currentIndex, currentIndex + itemsPerPage).map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                    ))}
                </div>
                <div className="flex gap-4 mt-6">
                    <Button onClick={prevProfiles} disabled={currentIndex === 0} variant="outline" className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <Button onClick={nextProfiles} disabled={currentIndex + itemsPerPage >= profiles.length} variant="outline" className="rounded-full">
                        <ArrowRight className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
