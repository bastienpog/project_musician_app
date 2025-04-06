import { PlayCircle, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// Define types for the media items and user profile
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

// Reusable profile card component
export const ProfileCard: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    const { profile_picture, cover_image, items } = profile.media;

    return (
        <Card className="overflow-hidden bg-black/20 border-white/20 text-white shadow-2xl">
            {/* Header with cover image and avatar */}
            <CardHeader className="relative">
                {/* Cover image fallback */}
                <img src={cover_image || "/fallback-cover.jpg"} className="w-full h-48 object-cover" />

                {/* Avatar + username + bio overlayed on the cover image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                    <img
                        src={profile_picture || "/fallback-avatar.jpg"}
                        className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
                    />
                    <div className="ml-4">
                        <h2 className="text-2xl font-bold">@{profile.username}</h2>
                        <p className="text-sm text-white/80">{profile.info}</p>
                    </div>
                </div>
            </CardHeader>

            {/* Section for listing featured media items */}
            <CardContent className="p-4">
                <h3 className="text-lg font-medium">Featured Media</h3>

                {/* Grid layout to display media previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map(({ id, type, title, subtitle, thumbnailUrl }) => (
                        <div
                            key={id}
                            className="relative rounded-xl overflow-hidden cursor-pointer"
                        >
                            <img
                                src={thumbnailUrl}
                                className="w-full aspect-video object-cover"
                            // Thumbnail of the media item
                            />
                            <div className="absolute inset-0 p-4">
                                {/* Conditional icon based on media type */}
                                {type === "video"
                                    ? <PlayCircle className="absolute top-4 right-4 w-8 h-8 text-white" />
                                    : <Music2 className="absolute top-4 right-4 w-8 h-8 text-white" />
                                }

                                {/* Media title and subtitle */}
                                <h4 className="font-medium text-sm mb-1">{title}</h4>
                                <p className="text-xs text-gray-300">{subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            {/* Footer with CTA button to initiate chat */}
            <CardFooter className="flex justify-end">
                <Button variant="secondary" className="bg-white text-pink-600 p-6">
                    Click here to chat with this artist !
                </Button>
            </CardFooter>
        </Card>
    );
};
