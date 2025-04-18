import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from './authStore';

export const Login: React.FC = () => {
    // Zustand store for auth state management
    const { login } = useAuthStore();

    // State to hold form input values
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Navigation hook from React Router
    const navigate = useNavigate();

    // Handle form submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
        navigate("/home");
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-white mb-12">Login</h1>

            <form onSubmit={handleLogin} className="flex flex-col flex-grow">
                <div className="space-y-6 flex-grow">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email address</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-white/20 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-white/30"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-white/20 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-white/30"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-white text-pink-600 hover:bg-white/90 h-12 mt-8 font-medium"
                >
                    Login
                </Button>
            </form>

            <Link to="/register" className="text-white underline mt-2">
                First time here? Register
            </Link>
        </div>
    );
};
