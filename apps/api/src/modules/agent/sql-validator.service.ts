import { Injectable } from '@nestjs/common';
import { ValidationResult } from './types/llm-config.types';

@Injectable()
export class SQLValidatorService {
    private readonly DANGEROUS_KEYWORDS = [
        'DELETE', 'DROP', 'UPDATE', 'INSERT', 'ALTER',
        'TRUNCATE', 'CREATE', 'GRANT', 'REVOKE', 'EXEC',
        'EXECUTE', 'CALL', 'MERGE', 'REPLACE',
    ];

    /**
     * Validate SQL for safety and correctness
     */
    validateSQL(sql: string, allowedTables: string[]): ValidationResult {
        const normalizedSQL = sql.trim().toUpperCase();
        const errors: string[] = [];

        // Check for dangerous keywords
        for (const keyword of this.DANGEROUS_KEYWORDS) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(normalizedSQL)) {
                errors.push(`Dangerous keyword detected: ${keyword}`);
            }
        }

        // Ensure SELECT only
        if (!normalizedSQL.startsWith('SELECT')) {
            errors.push('Only SELECT queries are allowed');
        }

        // Validate table names
        const tablePattern = /FROM\s+["']?(\w+)["']?/gi;
        const matches = [...sql.matchAll(tablePattern)];

        for (const match of matches) {
            const tableName = match[1];
            if (!allowedTables.includes(tableName)) {
                errors.push(`Invalid table name: ${tableName}. Allowed tables: ${allowedTables.join(', ')}`);
            }
        }

        // Add LIMIT if not present
        let validatedSQL = sql.trim();
        if (!normalizedSQL.includes('LIMIT')) {
            const limit = process.env.QUERY_RESULT_LIMIT || '100';
            validatedSQL = `${validatedSQL} LIMIT ${limit}`;
        }

        return {
            isValid: errors.length === 0,
            errors,
            validatedSQL,
        };
    }

    /**
     * Sanitize SQL to remove markdown code blocks
     */
    cleanSQL(sql: string): string {
        // Remove markdown code blocks
        sql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '');
        // Remove extra whitespace
        return sql.trim();
    }
}
