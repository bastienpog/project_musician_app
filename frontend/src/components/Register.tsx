import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from './authStore';

// Register component for creating a new user account
export const Register: React.FC = () => {
    // Destructuring the register function from auth store
    const { register } = useAuthStore();

    // Local state to manage form inputs (user name, email, password)
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Function to handle the form submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior

        // Registering the user through the auth store's register method
        await register(user, email, password);

        // Redirecting to the home page after successful registration
        navigate("/home");
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-white mb-12">Register</h1>

            {/* Form for user registration */}
            <form onSubmit={handleLogin} className="flex flex-col flex-grow">
                <div className="space-y-6 flex-grow">
                    {/* Username Input */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Username</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your username"
                            value={user}
                            onChange={(e) => setUser(e.target.value)} // Updates the user state with the input value
                            className="border-white/20 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-white/30"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email address</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Updates the email state with the input value
                            className="border-white/20 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-white/30"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Updates the password state with the input value
                            className="border-white/20 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-white/30"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full bg-white text-pink-600 hover:bg-white/90 h-12 mt-8 font-medium"
                >
                    Register
                </Button>
            </form>

            {/* Link to redirect users to the login page if they already have an account */}
            <Link to="/login" className="text-white underline mt-2">
                Already have an account? Login
            </Link>
        </div>
    );
};
