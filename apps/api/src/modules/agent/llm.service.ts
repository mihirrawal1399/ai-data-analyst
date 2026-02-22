import { Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import { LLMProviderFactory } from './llm-provider.factory';
import { LLMProvider, LLMProviderOptions, UsageMetrics } from './types/llm-config.types';
import { generateHardcodedSQL, generateHardcodedSummary } from './hardcoded.provider';

@Injectable()
export class LLMService {
    /**
     * Generate SQL from natural language
     * Returns both the SQL and usage metrics
     */
    async generateSQL(
        prompt: string,
        options: LLMProviderOptions = {}
    ): Promise<{ sql: string; metrics: UsageMetrics }> {
        const config = LLMProviderFactory.getProviderInfo(options);

        // Handle hardcoded provider (zero cost, no API call)
        if (config.provider === LLMProvider.HARDCODED) {
            const result = generateHardcodedSQL(prompt);
            return {
                sql: result.text.trim(),
                metrics: {
                    tokensUsed: 0,
                    estimatedCost: 0,
                    provider: LLMProvider.HARDCODED,
                    model: 'hardcoded-v1',
                    usedSystemKey: true,
                },
            };
        }

        const model = LLMProviderFactory.createProvider(options);

        const result = await generateText({
            model,
            prompt,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
        } as any);

        const metrics: UsageMetrics = {
            tokensUsed: result.usage.totalTokens || 0,
            estimatedCost: this.estimateCost(
                config.provider,
                result.usage.totalTokens || 0
            ),
            provider: config.provider,
            model: config.model,
            usedSystemKey: config.usingSystemKey,
        };

        return {
            sql: result.text.trim(),
            metrics,
        };
    }

    /**
     * Generate human-readable summary
     * Returns both the summary and usage metrics
     */
    async summarizeResults(
        prompt: string,
        options: LLMProviderOptions = {}
    ): Promise<{ summary: string; metrics: UsageMetrics }> {
        const config = LLMProviderFactory.getProviderInfo(options);

        // Handle hardcoded provider (zero cost, no API call)
        if (config.provider === LLMProvider.HARDCODED) {
            const result = generateHardcodedSummary(prompt);
            return {
                summary: result.text.trim(),
                metrics: {
                    tokensUsed: 0,
                    estimatedCost: 0,
                    provider: LLMProvider.HARDCODED,
                    model: 'hardcoded-v1',
                    usedSystemKey: true,
                },
            };
        }

        const model = LLMProviderFactory.createProvider(options);

        const result = await generateText({
            model,
            prompt,
            temperature: 0.3,
            maxTokens: 500,
        } as any);

        const metrics: UsageMetrics = {
            tokensUsed: result.usage.totalTokens || 0,
            estimatedCost: this.estimateCost(
                config.provider,
                result.usage.totalTokens || 0
            ),
            provider: config.provider,
            model: config.model,
            usedSystemKey: config.usingSystemKey,
        };

        return {
            summary: result.text.trim(),
            metrics,
        };
    }

    /**
     * Estimate cost based on provider and token usage
     * Prices as of Feb 2026 (update as needed)
     */
    private estimateCost(provider: string, tokens: number): number {
        // Cost per 1M tokens (input + output averaged)
        const costPer1MTokens: Record<string, number> = {
            [LLMProvider.OPENAI]: 0.15,        // gpt-4o-mini
            [LLMProvider.ANTHROPIC]: 3.0,       // claude-3-5-sonnet
            [LLMProvider.GOOGLE]: 0,            // gemini-2.0-flash (free tier)
            [LLMProvider.GROQ]: 0,              // free tier
            [LLMProvider.COHERE]: 0,            // free tier
            [LLMProvider.NVIDIA_NIM]: 0,        // free tier
            [LLMProvider.GITHUB_MODELS]: 0,     // free with PAT
            [LLMProvider.OLLAMA]: 0,            // local
            [LLMProvider.HARDCODED]: 0,         // mock
        };

        const cost = costPer1MTokens[provider] || 0;
        return (tokens / 1_000_000) * cost;
    }

    /**
     * Get provider information
     */
    getProviderInfo(options: LLMProviderOptions = {}) {
        return LLMProviderFactory.getProviderInfo(options);
    }

    /**
     * List all available providers
     */
    getAvailableProviders() {
        return LLMProviderFactory.getAvailableProviders();
    }
}
