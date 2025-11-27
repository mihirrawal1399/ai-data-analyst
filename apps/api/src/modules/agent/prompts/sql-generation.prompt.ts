export interface SQLGenerationContext {
    datasetName: string;
    schemaInfo: string;
    sampleRows: string;
    question: string;
    rowLimit: number;
}

export function buildSQLGenerationPrompt(context: SQLGenerationContext): string {
    return `You are a PostgreSQL expert. Generate a SQL query based on the user's question.

Dataset: ${context.datasetName}

Tables and Columns:
${context.schemaInfo}

Sample Data (first 3 rows):
${context.sampleRows}

IMPORTANT RULES:
1. Generate ONLY a SELECT query - no other SQL operations
2. Use proper PostgreSQL syntax
3. Return ONLY the SQL query with no explanations, markdown, or code blocks
4. Use table and column names EXACTLY as shown above
5. The query will automatically be limited to ${context.rowLimit} rows
6. Use appropriate WHERE clauses, JOINs, and aggregations as needed
7. Handle NULL values appropriately
8. Use proper PostgreSQL functions and operators

User Question: ${context.question}

SQL Query:`;
}
