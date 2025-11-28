import { Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import { LLMProviderFactory } from './llm-provider.factory';
import { LLMProviderOptions, UsageMetrics } from './types/llm-config.types';

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
        const model = LLMProviderFactory.createProvider(options);
        const config = LLMProviderFactory.getProviderInfo(options);

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
        const model = LLMProviderFactory.createProvider(options);
        const config = LLMProviderFactory.getProviderInfo(options);

        const result = await generateText({
            model,
            prompt,
            temperature: 0.3, // Slightly higher for natural summaries
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
     * Prices as of Nov 2024 (update as needed)
     */
    private estimateCost(provider: string, tokens: number): number {
        // Cost per 1M tokens (input + output averaged)
        const costPer1MTokens: Record<string, number> = {
            openai: 0.15, // gpt-4o-mini
            anthropic: 3.0, // claude-3-5-sonnet
            google: 0.075, // gemini-1.5-flash
            groq: 0.05, // llama-3.1-8b
            ollama: 0, // free
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
}
