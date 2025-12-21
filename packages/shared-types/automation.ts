/** Automation Types */

export enum AutomationType {
    SUMMARY = 'summary',
    ALERT = 'alert',
    TREND = 'trend',
    CUSTOM = 'custom',
}

export interface AutomationConfig {
    // For summary
    includeCharts?: string[];

    // For alerts
    thresholds?: {
        metric: string;
        operator: '>' | '<' | '=' | '>=' | '<=';
        value: number;
    }[];

    // For trends
    timeRange?: string; // e.g., "7d", "30d"
    metrics?: string[];

    // Email settings
    recipients?: string[];
    emailFormat?: 'plain' | 'html';
}

export interface AutomationHistoryResult {
    id: string;
    automationId: string;
    status: 'success' | 'failure';
    output: string | null;
    error: string | null;
    metrics?: any;
    executedAt: Date;
    durationMs?: number;
}

export interface EmailPayload {
    to: string[];
    subject: string;
    htmlBody?: string;
    textBody?: string;
}

export interface TrendAnalysisPayload {
    datasetId: string;
    metrics: string[];
    timeRange: string;
    direction?: 'up' | 'down' | 'both';
}

export interface SummaryPayload {
    dashboardId?: string;
    datasetId?: string;
    title: string;
    content: string;
    charts?: any[];
}

export interface CreateAutomationDto {
    userId: string;
    dashboardId?: string;
    datasetId?: string;
    name: string;
    description?: string;
    schedule: string;
    type: AutomationType;
    config: AutomationConfig;
    enabled?: boolean;
}

export interface UpdateAutomationDto {
    name?: string;
    description?: string;
    schedule?: string;
    config?: AutomationConfig;
    enabled?: boolean;
}
