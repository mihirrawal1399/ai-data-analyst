import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Use CSS variables for theming
                primary: {
                    1: "var(--color-primary-1)",
                    2: "var(--color-primary-2)",
                },
                secondary: {
                    1: "var(--color-secondary-1)",
                    2: "var(--color-secondary-2)",
                },
                accent: "var(--color-accent)",
                surface: "var(--color-surface)",
                glow: "var(--color-glow)",
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                muted: "var(--color-muted)",
                border: "var(--color-border)",
            },
            boxShadow: {
                neon: "var(--shadow-neon)",
                glow: "var(--shadow-glow)",
            },
            backdropBlur: {
                xs: "2px",
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-in-out",
                "slide-in": "slideIn 0.3s ease-out",
                "glow-pulse": "glowPulse 2s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideIn: {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                glowPulse: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
