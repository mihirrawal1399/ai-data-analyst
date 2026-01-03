/** Dashboard & Dataset Insight Types */

export interface DashboardInsight {
    summary: string;
    patterns: TrendInsight[];
    anomalies: AnomalyInsight[];
    chartSuggestions: ChartSuggestion[];
    recommendedFilters?: string[];
    generatedAt: Date;
}

export interface DatasetInsight {
    summary: string;
    columnDescriptions: ColumnDescription[];
    dataQualityIssues: DataQualityIssue[];
    trends: TrendInsight[];
    chartSuggestions: ChartSuggestion[];
    generatedAt: Date;
}

export interface TrendInsight {
    metric: string;
    direction: 'up' | 'down' | 'stable';
    percentageChange?: number;
    description: string;
    confidence: number;
}

export interface AnomalyInsight {
    metric: string;
    value: number;
    expectedRange: { min: number; max: number };
    severity: 'low' | 'medium' | 'high';
    description: string;
}

export interface ChartSuggestion {
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
    title: string;
    xAxis: string;
    yAxis: string;
    reason: string;
}

export interface ColumnDescription {
    name: string;
    dataType: string;
    description: string;
    sampleValues: string[];
    nullPercentage: number;
}

export interface DataQualityIssue {
    column: string;
    issueType: 'missing_values' | 'outliers' | 'inconsistent_format' | 'duplicates';
    severity: 'low' | 'medium' | 'high';
    description: string;
    affectedRows: number;
}
