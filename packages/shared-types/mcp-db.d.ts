export interface McpSchemaResponse {
    tables: {
        name: string;
        columns: {
            name: string;
            type: string;
            nullable: boolean;
        }[];
    }[];
}
export interface McpQueryResult {
    columns: string[];
    rows: any[];
    rowCount: number;
}
export interface McpErrorResponse {
    error: string;
    code?: 'VALIDATION_ERROR' | 'EXECUTION_ERROR' | 'CONNECTION_ERROR' | 'NOT_FOUND' | 'UNKNOWN_ERROR';
    details?: any;
}
export interface McpDatasetTableResponse {
    datasetId: string;
    tables: {
        id: string;
        name: string;
        rowCount: number;
    }[];
}
export type McpDbActions = 'ping' | 'getSchema' | 'getTables' | 'getColumns' | 'describeTable' | 'executeQuery' | 'getDatasetTable';
