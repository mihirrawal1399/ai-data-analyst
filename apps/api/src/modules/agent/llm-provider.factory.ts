import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
    LLMProvider,
    LLMConfig,
    LLMProviderOptions,
    SystemKeyPool,
    UserTier
} from './types/llm-config.types';

export class LLMProviderFactory {
    private static systemKeyPools: Map<LLMProvider, SystemKeyPool> = new Map();
    private static initialized = false;

    /**
     * Initialize system key pools from environment variables
     * Supports multiple keys per provider for load balancing
     */
    static initialize() {
        if (this.initialized) return;

        this.initializeKeyPool(LLMProvider.OPENAI, process.env.OPENAI_API_KEY);
        this.initializeKeyPool(LLMProvider.ANTHROPIC, process.env.ANTHROPIC_API_KEY);
        this.initializeKeyPool(LLMProvider.GOOGLE, process.env.GOOGLE_API_KEY);
        this.initializeKeyPool(LLMProvider.GROQ, process.env.GROQ_API_KEY);

        this.initialized = true;
        console.log('[LLMProviderFactory] Initialized with providers:',
            Array.from(this.systemKeyPools.keys()));
    }

    private static initializeKeyPool(provider: LLMProvider, keysString?: string) {
        if (!keysString) return;

        const keys = keysString.split(',').map(k => k.trim()).filter(k => k);
        if (keys.length > 0) {
            this.systemKeyPools.set(provider, {
                provider,
                keys,
                currentIndex: 0,
            });
            console.log(`[LLMProviderFactory] Loaded ${keys.length} key(s) for ${provider}`);
        }
    }

    /**
     * Get next available system key using round-robin
     * This distributes load across multiple API keys
     */
    private static getSystemKey(provider: LLMProvider): string | undefined {
        const pool = this.systemKeyPools.get(provider);
        if (!pool || pool.keys.length === 0) return undefined;

        const key = pool.keys[pool.currentIndex];
        pool.currentIndex = (pool.currentIndex + 1) % pool.keys.length;

        return key;
    }

    /**
     * Create LLM provider instance
     * Supports both system keys and BYOK
     */
    static createProvider(options: LLMProviderOptions = {}): any {
        this.initialize();
        const config = this.buildConfig(options);
        return this.instantiateProvider(config);
    }

    /**
     * Build LLM configuration based on options
     * Future: This will check user tier, quotas, and BYOK settings
     */
    private static buildConfig(options: LLMProviderOptions): LLMConfig {
        // Determine provider
        let provider = options.provider ||
            (process.env.LLM_PROVIDER as LLMProvider) ||
            LLMProvider.OPENAI;

        // Determine model
        let model = options.model ||
            this.getDefaultModel(provider);

        // Determine API key
        let apiKey: string | undefined;

        if (options.useUserKey && options.apiKey) {
            // BYOK: User provided their own key
            apiKey = options.apiKey;
        } else {
            // System key: Get from pool
            apiKey = this.getSystemKey(provider);

            // Fallback to OLLAMA if no system key available
            if (!apiKey && provider !== LLMProvider.OLLAMA) {
                console.warn(`[LLMProviderFactory] No system key available for ${provider}, falling back to OLLAMA`);
                provider = LLMProvider.OLLAMA;
                model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
            }
        }

        return {
            provider,
            model,
            apiKey,
            maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2000'),
            temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.1'),
        };
    }

    /**
     * Get default model for each provider
     */
    private static getDefaultModel(provider: LLMProvider): string {
        const defaults = {
            [LLMProvider.OPENAI]: process.env.LLM_MODEL || 'gpt-4o-mini',
            [LLMProvider.ANTHROPIC]: 'claude-3-5-sonnet-20241022',
            [LLMProvider.GOOGLE]: 'gemini-1.5-flash',
            [LLMProvider.GROQ]: 'llama-3.1-8b-instant',
            [LLMProvider.OLLAMA]: process.env.OLLAMA_MODEL || 'llama3.1:8b',
        };

        return defaults[provider];
    }

    /**
     * Instantiate the actual provider SDK
     */
    private static instantiateProvider(config: LLMConfig): any {
        switch (config.provider) {
            case LLMProvider.OPENAI:
                if (!config.apiKey) {
                    throw new Error('OpenAI API key is required');
                }
                const openai = createOpenAI({ apiKey: config.apiKey });
                return openai(config.model);

            case LLMProvider.ANTHROPIC:
                if (!config.apiKey) {
                    throw new Error('Anthropic API key is required');
                }
                const anthropic = createAnthropic({ apiKey: config.apiKey });
                return anthropic(config.model);

            case LLMProvider.GOOGLE:
                if (!config.apiKey) {
                    throw new Error('Google API key is required');
                }
                const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
                return google(config.model);

            case LLMProvider.GROQ:
                // Note: Groq support would need @ai-sdk/groq package
                throw new Error('Groq provider not yet implemented - install @ai-sdk/groq');

            case LLMProvider.OLLAMA:
                // Note: Ollama support would need ollama-ai-provider package
                throw new Error('Ollama provider not yet implemented - install ollama-ai-provider');

            default:
                throw new Error(`Unsupported LLM provider: ${config.provider}`);
        }
    }

    /**
     * Get provider configuration info
     * Useful for logging and debugging
     */
    static getProviderInfo(options: LLMProviderOptions = {}) {
        this.initialize();
        const config = this.buildConfig(options);

        return {
            provider: config.provider,
            model: config.model,
            maxTokens: config.maxTokens,
            temperature: config.temperature,
            usingSystemKey: !options.useUserKey,
            hasApiKey: !!config.apiKey,
        };
    }

    /**
     * Future: Check if user is allowed to use a specific provider
     * Based on their tier and quota
     */
    static isProviderAllowedForTier(
        provider: LLMProvider,
        tier: UserTier
    ): boolean {
        const allowedProviders = this.getAllowedProvidersForTier(tier);
        return allowedProviders.includes(provider);
    }

    /**
     * Future: Get allowed providers for user tier
     */
    private static getAllowedProvidersForTier(tier: UserTier): LLMProvider[] {
        const tierProviders = {
            [UserTier.GUEST]: [LLMProvider.OLLAMA, LLMProvider.GOOGLE],
            [UserTier.FREE]: [LLMProvider.OPENAI, LLMProvider.GOOGLE, LLMProvider.GROQ],
            [UserTier.PREMIUM]: [LLMProvider.OPENAI, LLMProvider.ANTHROPIC, LLMProvider.GOOGLE, LLMProvider.GROQ],
            [UserTier.ENTERPRISE]: Object.values(LLMProvider),
        };

        return tierProviders[tier] || tierProviders[UserTier.FREE];
    }
}
