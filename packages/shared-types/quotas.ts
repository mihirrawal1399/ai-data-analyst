export type UserRole = 'GUEST' | 'FREE' | 'PAID' | 'PREMIUM' | 'ENTERPRISE';

export const QUOTAS = {
    GUEST: {
        datasets: 0,        // Demo only
        charts: 1,
        dashboards: 0,
        queriesPerSession: 3,
        automations: 0,
        maxDatasetSize: 0,
    },
    FREE: {
        datasets: 3,
        charts: 5,
        dashboards: 2,
        queriesPerDay: 50,
        automations: 0,
        maxDatasetSize: 1048576, // 1MB
    },
    PAID: {
        datasets: 10,
        charts: 50,
        dashboards: 10,
        queriesPerDay: 500,
        automations: 5,
        maxDatasetSize: 10485760, // 10MB
    },
    PREMIUM: {
        datasets: 50,
        charts: 200,
        dashboards: 50,
        queriesPerDay: 2000,
        automations: 20,
        maxDatasetSize: 104857600, // 100MB
    },
    ENTERPRISE: {
        datasets: -1,      // Unlimited
        charts: -1,
        dashboards: -1,
        queriesPerDay: -1,
        automations: -1,
        maxDatasetSize: -1,
    },
} as const;

export function getQuotaForRole(role: UserRole) {
    return QUOTAS[role];
}
