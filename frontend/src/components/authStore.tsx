import { create } from "zustand";

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;

}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem("token"),

    login: async (email, password) => {
        const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            set({ token: data.token });
        } else {
            console.error(data.error);
        }
    },

    register: async (username, email, password) => {
        const res = await fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (res.ok) {
            await get().login(email, password);
        } else {
            const data = await res.json();
            console.error(data.error);
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
    },
}));


