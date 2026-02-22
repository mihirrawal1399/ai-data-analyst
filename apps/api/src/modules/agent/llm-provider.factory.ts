import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createCohere } from '@ai-sdk/cohere';
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
        this.initializeKeyPool(LLMProvider.COHERE, process.env.COHERE_API_KEY);
        this.initializeKeyPool(LLMProvider.NVIDIA_NIM, process.env.NVIDIA_NIM_API_KEY);
        this.initializeKeyPool(LLMProvider.GITHUB_MODELS, process.env.GITHUB_TOKEN);

        this.initialized = true;
        const providers = Array.from(this.systemKeyPools.keys());
        if (providers.length > 0) {
            console.log('[LLMProviderFactory] Initialized with providers:', providers);
        } else {
            console.log('[LLMProviderFactory] No API keys configured - using HARDCODED provider');
        }
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
     * Supports system keys, BYOK, and hardcoded fallback
     */
    static createProvider(options: LLMProviderOptions = {}): any {
        this.initialize();
        const config = this.buildConfig(options);

        // Return null for HARDCODED - handled directly in LLMService
        if (config.provider === LLMProvider.HARDCODED) {
            return null;
        }

        return this.instantiateProvider(config);
    }

    /**
     * Build LLM configuration based on options
     */
    private static buildConfig(options: LLMProviderOptions): LLMConfig {
        // Determine provider
        let provider = options.provider ||
            (process.env.LLM_PROVIDER as LLMProvider) ||
            LLMProvider.GOOGLE; // Default to Google (free tier)

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

            // Fallback chain: try free providers, then hardcoded
            if (!apiKey && provider !== LLMProvider.HARDCODED) {
                const fallbackOrder = [
                    LLMProvider.GOOGLE,
                    LLMProvider.GROQ,
                    LLMProvider.COHERE,
                    LLMProvider.NVIDIA_NIM,
                    LLMProvider.GITHUB_MODELS,
                ];

                for (const fallback of fallbackOrder) {
                    if (fallback === provider) continue;
                    const fallbackKey = this.getSystemKey(fallback);
                    if (fallbackKey) {
                        console.log(`[LLMProviderFactory] No key for ${provider}, falling back to ${fallback}`);
                        provider = fallback;
                        apiKey = fallbackKey;
                        model = this.getDefaultModel(fallback);
                        break;
                    }
                }

                // Ultimate fallback: hardcoded (zero cost, no API key needed)
                if (!apiKey) {
                    console.log(`[LLMProviderFactory] No API keys available - using HARDCODED provider`);
                    provider = LLMProvider.HARDCODED;
                    model = 'hardcoded-v1';
                }
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
        const defaults: Record<string, string> = {
            [LLMProvider.OPENAI]: process.env.LLM_MODEL || 'gpt-4o-mini',
            [LLMProvider.ANTHROPIC]: 'claude-3-5-sonnet-20241022',
            [LLMProvider.GOOGLE]: 'gemini-2.0-flash',
            [LLMProvider.GROQ]: 'llama-3.1-8b-instant',
            [LLMProvider.COHERE]: 'command-r',
            [LLMProvider.NVIDIA_NIM]: 'nvidia/nemotron-mini-4b-instruct',
            [LLMProvider.GITHUB_MODELS]: 'gpt-4o-mini',
            [LLMProvider.OLLAMA]: process.env.OLLAMA_MODEL || 'llama3.1:8b',
            [LLMProvider.HARDCODED]: 'hardcoded-v1',
        };

        return defaults[provider] || 'gpt-4o-mini';
    }

    /**
     * Instantiate the actual provider SDK
     */
    private static instantiateProvider(config: LLMConfig): any {
        switch (config.provider) {
            case LLMProvider.OPENAI: {
                if (!config.apiKey) throw new Error('OpenAI API key is required');
                const openai = createOpenAI({ apiKey: config.apiKey });
                return openai(config.model);
            }

            case LLMProvider.ANTHROPIC: {
                if (!config.apiKey) throw new Error('Anthropic API key is required');
                const anthropic = createAnthropic({ apiKey: config.apiKey });
                return anthropic(config.model);
            }

            case LLMProvider.GOOGLE: {
                if (!config.apiKey) throw new Error('Google API key is required');
                const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
                return google(config.model);
            }

            case LLMProvider.GROQ: {
                if (!config.apiKey) throw new Error('Groq API key is required');
                const groq = createGroq({ apiKey: config.apiKey });
                return groq(config.model);
            }

            case LLMProvider.COHERE: {
                if (!config.apiKey) throw new Error('Cohere API key is required');
                const cohere = createCohere({ apiKey: config.apiKey });
                return cohere(config.model);
            }

            case LLMProvider.NVIDIA_NIM: {
                // NVIDIA NIM uses OpenAI-compatible API
                if (!config.apiKey) throw new Error('NVIDIA NIM API key is required');
                const nvidia = createOpenAI({
                    apiKey: config.apiKey,
                    baseURL: 'https://integrate.api.nvidia.com/v1',
                });
                return nvidia(config.model);
            }

            case LLMProvider.GITHUB_MODELS: {
                // GitHub Models uses Azure OpenAI-compatible API
                if (!config.apiKey) throw new Error('GitHub token is required');
                const github = createOpenAI({
                    apiKey: config.apiKey,
                    baseURL: 'https://models.inference.ai.azure.com',
                });
                return github(config.model);
            }

            case LLMProvider.OLLAMA: {
                // Ollama uses OpenAI-compatible API locally
                const ollama = createOpenAI({
                    apiKey: 'ollama', // Ollama doesn't need a real key
                    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
                });
                return ollama(config.model);
            }

            case LLMProvider.HARDCODED:
                return null; // Handled in LLMService directly

            default:
                throw new Error(`Unsupported LLM provider: ${config.provider}`);
        }
    }

    /**
     * Get provider configuration info
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
            hasApiKey: !!config.apiKey || config.provider === LLMProvider.HARDCODED,
        };
    }

    /**
     * Check if user is allowed to use a specific provider based on tier
     */
    static isProviderAllowedForTier(
        provider: LLMProvider,
        tier: UserTier
    ): boolean {
        const allowedProviders = this.getAllowedProvidersForTier(tier);
        return allowedProviders.includes(provider);
    }

    /**
     * Get allowed providers for user tier
     */
    private static getAllowedProvidersForTier(tier: UserTier): LLMProvider[] {
        const tierProviders = {
            [UserTier.GUEST]: [LLMProvider.HARDCODED, LLMProvider.GOOGLE, LLMProvider.GROQ],
            [UserTier.FREE]: [LLMProvider.HARDCODED, LLMProvider.GOOGLE, LLMProvider.GROQ, LLMProvider.COHERE, LLMProvider.GITHUB_MODELS],
            [UserTier.PREMIUM]: [LLMProvider.HARDCODED, LLMProvider.OPENAI, LLMProvider.ANTHROPIC, LLMProvider.GOOGLE, LLMProvider.GROQ, LLMProvider.COHERE, LLMProvider.NVIDIA_NIM, LLMProvider.GITHUB_MODELS],
            [UserTier.ENTERPRISE]: Object.values(LLMProvider),
        };

        return tierProviders[tier] || tierProviders[UserTier.FREE];
    }

    /**
     * List all available providers (those with keys or hardcoded)
     */
    static getAvailableProviders(): { provider: LLMProvider; model: string; free: boolean }[] {
        this.initialize();
        const available: { provider: LLMProvider; model: string; free: boolean }[] = [];

        // Always available
        available.push({
            provider: LLMProvider.HARDCODED,
            model: 'hardcoded-v1',
            free: true,
        });

        // Check each provider for configured keys
        const providers = [
            { provider: LLMProvider.GOOGLE, free: true },
            { provider: LLMProvider.GROQ, free: true },
            { provider: LLMProvider.COHERE, free: true },
            { provider: LLMProvider.NVIDIA_NIM, free: true },
            { provider: LLMProvider.GITHUB_MODELS, free: true },
            { provider: LLMProvider.OPENAI, free: false },
            { provider: LLMProvider.ANTHROPIC, free: false },
        ];

        for (const p of providers) {
            if (this.systemKeyPools.has(p.provider)) {
                available.push({
                    provider: p.provider,
                    model: this.getDefaultModel(p.provider),
                    free: p.free,
                });
            }
        }

        return available;
    }
}
