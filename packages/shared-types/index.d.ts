export interface ExampleType {
    id: string;
    createdAt: string;
}
export type Result<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: string;
};
export * from './chart.types';
export * from './mcp-db';
