import { db } from './db';
import { McpDatasetTableResponse, McpErrorResponse } from '../../../packages/shared-types/mcp-db';

/**
 * Service for mapping dataset IDs to their associated tables
 */
export class DatasetMappingService {
    /**
     * Get all tables associated with a dataset
     * @param datasetId - UUID of the dataset
     * @returns Dataset ID and list of tables
     */
    async getDatasetTables(datasetId: string): Promise<McpDatasetTableResponse> {
        try {
            // Query DatasetTable model to get all tables for this dataset
            const result = await db.query(
                `SELECT 
                    dt.id,
                    dt.name,
                    dt."rowCount"
                FROM "DatasetTable" dt
                WHERE dt."datasetId" = $1
                ORDER BY dt.name ASC`,
                [datasetId]
            );

            if (result.rows.length === 0) {
                throw {
                    code: 'NOT_FOUND',
                    message: `No tables found for dataset ${datasetId}`
                };
            }

            return {
                datasetId,
                tables: result.rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    rowCount: row.rowCount
                }))
            };
        } catch (error: any) {
            // Re-throw with proper error code if not already structured
            if (error.code) {
                throw error;
            }
            throw {
                code: 'EXECUTION_ERROR',
                message: `Failed to get tables for dataset: ${error.message}`,
                details: error
            };
        }
    }
}

export const datasetMappingService = new DatasetMappingService();
