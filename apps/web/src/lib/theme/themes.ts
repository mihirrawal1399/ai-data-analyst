export type ThemeName = 'vaporwave' | 'professional' | 'minimal' | 'ocean' | 'sunset';

export interface Theme {
    name: ThemeName;
    displayName: string;
    description: string;
    colors: {
        primary1: string;
        primary2: string;
        secondary1: string;
    };
}

export const themes: Record<ThemeName, Theme> = {
    vaporwave: {
        name: 'vaporwave',
        displayName: 'Vaporwave',
        description: 'Retro cyberpunk aesthetics with neon glows',
        colors: {
            primary1: '#8a5cff',
            primary2: '#00e0e0',
            secondary1: '#ff68a6',
        },
    },
    professional: {
        name: 'professional',
        displayName: 'Professional',
        description: 'Clean and modern business theme',
        colors: {
            primary1: '#3b82f6',
            primary2: '#06b6d4',
            secondary1: '#8b5cf6',
        },
    },
    minimal: {
        name: 'minimal',
        displayName: 'Minimal',
        description: 'Subtle and understated design',
        colors: {
            primary1: '#18181b',
            primary2: '#27272a',
            secondary1: '#52525b',
        },
    },
    ocean: {
        name: 'ocean',
        displayName: 'Ocean',
        description: 'Deep blue aquatic vibes',
        colors: {
            primary1: '#0ea5e9',
            primary2: '#06b6d4',
            secondary1: '#6366f1',
        },
    },
    sunset: {
        name: 'sunset',
        displayName: 'Sunset',
        description: 'Warm orange and pink gradients',
        colors: {
            primary1: '#f97316',
            primary2: '#fb923c',
            secondary1: '#ec4899',
        },
    },
};

export const defaultTheme: ThemeName = 'vaporwave';
