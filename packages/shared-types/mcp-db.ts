export interface McpSchemaResponse {
    tables: Array<{
        name: string;
        columns: Array<{
            name: string;
            type: string;
            nullable: boolean;
        }>;
    }>;
}

export interface McpQueryResult {
    columns: string[];
    rows: Array<Record<string, any>>;
    rowCount: number;
}

export interface McpErrorResponse {
    error: string;
    details?: any;
}

export type McpDbActions =
    | "getSchema"
    | "getTables"
    | "getColumns"
    | "describeTable"
    | "executeQuery"
    | "ping";
