import { create } from "zustand";

// User model definition
interface User {
    id: string;
    username: string;
    email: string;
}

// Zustand state shape for authentication
interface AuthState {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Create Zustand store for authentication
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem("token"),

    // Login function
    login: async (email, password) => {
        const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            // Save token and user ID to localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);

            set({ token: data.token, user: { id: data.userId, email, username: data.username } });
        } else {
            console.error(data.error);
        }
    },

    // Register function
    register: async (username, email, password) => {
        const res = await fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (res.ok) {
            // Automatically log in after successful registration
            await get().login(email, password);
        } else {
            const data = await res.json();
            console.error(data.error);
        }
    },

    // Logout function
    logout: () => {
        // Clear user session from localStorage and Zustand
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        set({ user: null, token: null });
    },
}));
