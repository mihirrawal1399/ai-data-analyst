export const DEMO_DATASET_ID = 'demo-dataset-001';
export const DEMO_USER_EMAIL = 'demo@system.local';

export function isDemoDataset(datasetId: string): boolean {
    return datasetId === DEMO_DATASET_ID;
}

export function isDemoUser(email: string | null): boolean {
    return email === DEMO_USER_EMAIL;
}
