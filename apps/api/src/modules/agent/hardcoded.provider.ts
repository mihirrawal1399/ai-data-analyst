/**
 * Hardcoded/Mock LLM Provider
 * 
 * Provides zero-cost testing by pattern-matching common natural language queries
 * and returning templated SQL. Used when no API keys are configured.
 */

interface HardcodedResult {
    text: string;
    usage: { totalTokens: number };
}

/**
 * Pattern-match a natural language question and generate SQL for a given table schema.
 */
export function generateHardcodedSQL(prompt: string): HardcodedResult {
    // Extract table name from prompt (look for FROM "tablename" or Table: tablename patterns)
    const tableMatch = prompt.match(/Table:\s*(\S+)/i) || prompt.match(/FROM\s+"?(\w+)"?/i);
    const tableName = tableMatch ? tableMatch[1] : 'data';

    // Extract column names from prompt
    const columnMatches = prompt.match(/[-•]\s*(\w+)\s*\(/g) || [];
    const columns = columnMatches.map(m => m.replace(/[-•]\s*/, '').replace(/\s*\(/, ''));

    // Extract the actual question from the prompt
    const questionMatch = prompt.match(/Question:\s*(.+?)(?:\n|$)/i) ||
        prompt.match(/User's question:\s*(.+?)(?:\n|$)/i);
    const question = questionMatch ? questionMatch[1].toLowerCase().trim() : prompt.toLowerCase();

    let sql = '';

    // Pattern matching for common query types
    if (question.match(/\b(show\s+all|list\s+all|get\s+all|display\s+all|select\s+all)\b/)) {
        sql = `SELECT * FROM "${tableName}" LIMIT 100`;
    }
    else if (question.match(/\b(count|how\s+many|total\s+number|total\s+count)\b/)) {
        const groupCol = findGroupByColumn(question, columns);
        if (groupCol) {
            sql = `SELECT "${groupCol}", COUNT(*) as count FROM "${tableName}" GROUP BY "${groupCol}" ORDER BY count DESC LIMIT 20`;
        } else {
            sql = `SELECT COUNT(*) as total_count FROM "${tableName}"`;
        }
    }
    else if (question.match(/\b(top\s+\d+|best\s+\d+|highest\s+\d+)\b/)) {
        const numMatch = question.match(/\b(?:top|best|highest)\s+(\d+)\b/);
        const limit = numMatch ? parseInt(numMatch[1]) : 10;
        const numericCol = findNumericColumn(columns, prompt);
        sql = `SELECT * FROM "${tableName}" ORDER BY "${numericCol}" DESC LIMIT ${limit}`;
    }
    else if (question.match(/\b(average|avg|mean)\b/)) {
        const numericCol = findTargetColumn(question, columns) || findNumericColumn(columns, prompt);
        const groupCol = findGroupByColumn(question, columns);
        if (groupCol) {
            sql = `SELECT "${groupCol}", AVG("${numericCol}") as average FROM "${tableName}" GROUP BY "${groupCol}" ORDER BY average DESC`;
        } else {
            sql = `SELECT AVG("${numericCol}") as average FROM "${tableName}"`;
        }
    }
    else if (question.match(/\b(sum|total)\b/) && !question.match(/\b(count|number)\b/)) {
        const numericCol = findTargetColumn(question, columns) || findNumericColumn(columns, prompt);
        const groupCol = findGroupByColumn(question, columns);
        if (groupCol) {
            sql = `SELECT "${groupCol}", SUM("${numericCol}") as total FROM "${tableName}" GROUP BY "${groupCol}" ORDER BY total DESC`;
        } else {
            sql = `SELECT SUM("${numericCol}") as total FROM "${tableName}"`;
        }
    }
    else if (question.match(/\b(group\s*by|breakdown|by\s+category|per|distribution)\b/)) {
        const groupCol = findGroupByColumn(question, columns);
        const numericCol = findNumericColumn(columns, prompt);
        if (groupCol && numericCol) {
            sql = `SELECT "${groupCol}", COUNT(*) as count, AVG("${numericCol}") as avg_value FROM "${tableName}" GROUP BY "${groupCol}" ORDER BY count DESC`;
        } else if (groupCol) {
            sql = `SELECT "${groupCol}", COUNT(*) as count FROM "${tableName}" GROUP BY "${groupCol}" ORDER BY count DESC`;
        } else {
            sql = `SELECT * FROM "${tableName}" LIMIT 50`;
        }
    }
    else if (question.match(/\b(max|maximum|highest|largest|biggest)\b/)) {
        const numericCol = findTargetColumn(question, columns) || findNumericColumn(columns, prompt);
        sql = `SELECT MAX("${numericCol}") as max_value FROM "${tableName}"`;
    }
    else if (question.match(/\b(min|minimum|lowest|smallest)\b/)) {
        const numericCol = findTargetColumn(question, columns) || findNumericColumn(columns, prompt);
        sql = `SELECT MIN("${numericCol}") as min_value FROM "${tableName}"`;
    }
    else if (question.match(/\b(recent|latest|newest|last)\b/)) {
        const dateCol = findDateColumn(columns, prompt);
        sql = `SELECT * FROM "${tableName}" ORDER BY "${dateCol}" DESC LIMIT 10`;
    }
    else if (question.match(/\b(trend|over\s+time|time\s+series|monthly|daily|weekly|yearly)\b/)) {
        const dateCol = findDateColumn(columns, prompt);
        const numericCol = findNumericColumn(columns, prompt);
        sql = `SELECT "${dateCol}", AVG("${numericCol}") as value FROM "${tableName}" GROUP BY "${dateCol}" ORDER BY "${dateCol}" ASC`;
    }
    else if (question.match(/\b(unique|distinct)\b/)) {
        const targetCol = findTargetColumn(question, columns) || columns[0] || 'id';
        sql = `SELECT DISTINCT "${targetCol}", COUNT(*) as count FROM "${tableName}" GROUP BY "${targetCol}" ORDER BY count DESC LIMIT 50`;
    }
    else if (question.match(/\b(where|filter|only|with)\b.*\b(=|is|equals|greater|less|more|above|below)\b/)) {
        // Generic filtered query - just return all with limit
        sql = `SELECT * FROM "${tableName}" LIMIT 50`;
    }
    else {
        // Default: return first 50 rows
        sql = `SELECT * FROM "${tableName}" LIMIT 50`;
    }

    return {
        text: sql,
        usage: { totalTokens: 0 },
    };
}

/**
 * Generate a hardcoded summary based on question and results.
 */
export function generateHardcodedSummary(prompt: string): HardcodedResult {
    // Extract key info from the prompt
    const rowCountMatch = prompt.match(/(\d+)\s*rows?\s*(returned|found|result)/i) ||
        prompt.match(/Row count:\s*(\d+)/i);
    const rowCount = rowCountMatch ? parseInt(rowCountMatch[1]) : 0;

    const questionMatch = prompt.match(/Question:\s*(.+?)(?:\n|$)/i) ||
        prompt.match(/User asked:\s*(.+?)(?:\n|$)/i) ||
        prompt.match(/Original question:\s*(.+?)(?:\n|$)/i);
    const question = questionMatch ? questionMatch[1].trim() : 'the data';

    let summary: string;

    if (rowCount === 0) {
        summary = `No results were found for your query about ${question}. The dataset may not contain matching records, or the query criteria may be too restrictive.`;
    } else if (rowCount === 1) {
        summary = `Found exactly 1 result for your query. The data shows a single matching record for "${question}".`;
    } else if (rowCount <= 10) {
        summary = `Found ${rowCount} results. The query returned a small set of records related to "${question}". Review the data below for specific values and patterns.`;
    } else if (rowCount <= 100) {
        summary = `The query returned ${rowCount} rows of data related to "${question}". This is a moderate dataset - consider grouping or aggregating for deeper insights.`;
    } else {
        summary = `The query returned ${rowCount} rows. This is a large result set for "${question}". Consider narrowing your query with filters or using aggregations (COUNT, AVG, SUM) for better analysis.`;
    }

    return {
        text: summary,
        usage: { totalTokens: 0 },
    };
}

// --- Helper functions for column detection ---

function findNumericColumn(columns: string[], prompt: string): string {
    const numericHints = ['amount', 'price', 'cost', 'revenue', 'salary', 'total', 'count',
        'quantity', 'value', 'score', 'rating', 'age', 'size', 'weight',
        'height', 'rate', 'percentage', 'profit', 'sales', 'income'];

    // Also check column types from prompt
    const typeMatches = prompt.match(/(\w+)\s*\((integer|numeric|float|double|decimal|real|bigint|smallint)\)/gi) || [];
    const numericFromType = typeMatches.map(m => m.split('(')[0].trim().toLowerCase());

    for (const col of columns) {
        if (numericFromType.includes(col.toLowerCase())) return col;
    }
    for (const col of columns) {
        if (numericHints.some(hint => col.toLowerCase().includes(hint))) return col;
    }
    // Fallback: return second column (first is often ID or name)
    return columns.length > 1 ? columns[1] : columns[0] || 'value';
}

function findDateColumn(columns: string[], prompt: string): string {
    const dateHints = ['date', 'time', 'created', 'updated', 'timestamp', 'day', 'month', 'year',
        'period', 'when', 'at', 'created_at', 'updated_at'];

    const typeMatches = prompt.match(/(\w+)\s*\((timestamp|date|datetime|timestamptz)\)/gi) || [];
    const dateFromType = typeMatches.map(m => m.split('(')[0].trim().toLowerCase());

    for (const col of columns) {
        if (dateFromType.includes(col.toLowerCase())) return col;
    }
    for (const col of columns) {
        if (dateHints.some(hint => col.toLowerCase().includes(hint))) return col;
    }
    return columns[0] || 'date';
}

function findGroupByColumn(question: string, columns: string[]): string | null {
    const groupHints = ['by', 'per', 'each', 'for each', 'group', 'category', 'type', 'status',
        'region', 'department', 'country', 'city', 'name'];

    // Check if question mentions "by <column>"
    for (const col of columns) {
        if (question.includes(`by ${col.toLowerCase()}`)) return col;
        if (question.includes(`per ${col.toLowerCase()}`)) return col;
        if (question.includes(`each ${col.toLowerCase()}`)) return col;
    }

    // Check if any column has a categorical name
    const categoricalHints = ['category', 'type', 'status', 'region', 'department', 'name',
        'country', 'city', 'state', 'group', 'class', 'kind', 'brand', 'gender'];
    for (const col of columns) {
        if (categoricalHints.some(hint => col.toLowerCase().includes(hint))) return col;
    }

    return null;
}

function findTargetColumn(question: string, columns: string[]): string | null {
    for (const col of columns) {
        if (question.includes(col.toLowerCase())) return col;
    }
    return null;
}
