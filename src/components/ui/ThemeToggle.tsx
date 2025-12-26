"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // Check initial theme from document class or localStorage
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const initialTheme = savedTheme || (document.documentElement.classList.contains("dark") ? "dark" : "light");
        setTheme(initialTheme);
        if (initialTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 group hover:bg-muted text-secondary hover:text-foreground overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun className={cn(
                    "w-5 h-5 absolute transition-all duration-500",
                    theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )} />
                <Moon className={cn(
                    "w-5 h-5 absolute transition-all duration-500",
                    theme === "light" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )} />
            </div>
            <span className="text-sm font-semibold">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>

            {/* Subtle indicator for theme state */}
            <div className={cn(
                "absolute right-4 w-2 h-2 rounded-full transition-all duration-500",
                theme === "dark" ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-slate-300"
            )} />
        </button>
    );
}
