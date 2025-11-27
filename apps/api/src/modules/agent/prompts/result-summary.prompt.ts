export interface ResultSummaryContext {
    question: string;
    sql: string;
    rowCount: number;
    results: any[];
}

export function buildResultSummaryPrompt(context: ResultSummaryContext): string {
    const resultsPreview = JSON.stringify(context.results.slice(0, 5), null, 2);

    return `Summarize the following query results in 2-3 clear sentences for a non-technical user.

Original Question: ${context.question}

SQL Query Used: ${context.sql}

Number of Results: ${context.rowCount}

Sample Results (first 5 rows):
${resultsPreview}

Provide a natural language summary that:
1. Directly answers the user's question
2. Highlights key findings or patterns
3. Uses plain English without technical jargon
4. Mentions specific numbers when relevant
5. Is concise and easy to understand

Summary:`;
}
