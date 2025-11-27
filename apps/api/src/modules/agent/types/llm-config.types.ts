export enum LLMProvider {
    OPENAI = 'openai',
    ANTHROPIC = 'anthropic',
    GOOGLE = 'google',
    GROQ = 'groq',
    OLLAMA = 'ollama',
}

export enum UserTier {
    GUEST = 'guest',
    FREE = 'free',
    PREMIUM = 'premium',
    ENTERPRISE = 'enterprise',
}

export interface LLMConfig {
    provider: LLMProvider;
    model: string;
    apiKey?: string;
    maxTokens?: number;
    temperature?: number;
}

export interface LLMProviderOptions {
    // User context (future use)
    userId?: string;
    userTier?: UserTier;

    // Key selection strategy
    useUserKey?: boolean;

    // Override defaults
    provider?: LLMProvider;
    model?: string;
    apiKey?: string;
}

export interface SystemKeyPool {
    provider: LLMProvider;
    keys: string[];
    currentIndex: number;
}

export interface UsageMetrics {
    tokensUsed: number;
    estimatedCost: number;
    provider: LLMProvider;
    model: string;
    usedSystemKey: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    validatedSQL: string;
}
