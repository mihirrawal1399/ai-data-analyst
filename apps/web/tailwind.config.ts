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
                // Vaporwave palette
                surface: 'rgba(255, 255, 255, 0.05)',
                'surface-hover': 'rgba(255, 255, 255, 0.08)',
                glow: '#8a5cff',
                neon: '#00e0e0',
                pink: '#ff68a6',
                vapor: {
                    purple: '#8a5cff',
                    cyan: '#00e0e0',
                    pink: '#ff68a6',
                    yellow: '#ffe066',
                    'deep-purple': '#9d4edd',
                    'electric-blue': '#7df9ff',
                },
                // Original theme variables
                primary: {
                    1: "var(--color-primary-1)",
                    2: "var(--color-primary-2)",
                },
                secondary: {
                    1: "var(--color-secondary-1)",
                    2: "var(--color-secondary-2)",
                },
                accent: "var(--color-accent)",
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                muted: "var(--color-muted)",
                border: "var(--color-border)",
            },
            boxShadow: {
                neon: '0 0 15px rgba(138, 92, 255, 0.6)',
                'neon-hover': '0 0 25px rgba(138, 92, 255, 0.8)',
                glow: '0 0 20px rgba(0, 224, 224, 0.5)',
                'glow-hover': '0 0 30px rgba(0, 224, 224, 0.7)',
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
                    "0%, 100%": { boxShadow: '0 0 15px rgba(138, 92, 255, 0.6)' },
                    "50%": { boxShadow: '0 0 30px rgba(138, 92, 255, 0.9)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
