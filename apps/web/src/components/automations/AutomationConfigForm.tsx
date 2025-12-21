'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AutomationType, AutomationConfig } from '@repo/shared-types/automation';

interface AutomationConfigFormProps {
    type: AutomationType;
    config: AutomationConfig;
    onChange: (config: AutomationConfig) => void;
    datasets: any[];
    dashboards: any[];
}

export function AutomationConfigForm({ type, config, onChange, datasets, dashboards }: AutomationConfigFormProps) {
    const handleUpdate = (updates: Partial<AutomationConfig>) => {
        onChange({ ...config, ...updates });
    };

    if (type === AutomationType.SUMMARY) {
        return (
            <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <p className="text-xs text-slate-400 italic">Generate a high-level AI summary of your data.</p>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label className="text-cyan-400">Recipients (comma separated)</Label>
                        <Input
                            placeholder="email@example.com, team@example.com"
                            className="bg-slate-900 border-slate-700 focus:border-cyan-500"
                            value={config.recipients?.join(', ') || ''}
                            onChange={(e) => handleUpdate({ recipients: e.target.value.split(',').map(s => s.trim()) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-cyan-400">Format</Label>
                        <Select
                            value={config.emailFormat || 'html'}
                            onValueChange={(val: any) => handleUpdate({ emailFormat: val })}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="html">Rich HTML</SelectItem>
                                <SelectItem value="plain">Plain Text</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        );
    }

    if (type === AutomationType.ALERT) {
        const threshold = config.thresholds?.[0] || { metric: '', operator: '>', value: 0 };

        return (
            <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <p className="text-xs text-rose-400 italic">Trigger notifications when values cross a threshold.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="text-rose-400">Column/Metric</Label>
                        <Input
                            placeholder="e.g. daily_sales"
                            className="bg-slate-900 border-slate-700 focus:border-rose-500"
                            value={threshold.metric}
                            onChange={(e) => handleUpdate({
                                thresholds: [{ ...threshold, metric: e.target.value }]
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-rose-400">Condition</Label>
                        <Select
                            value={threshold.operator}
                            onValueChange={(val: any) => handleUpdate({
                                thresholds: [{ ...threshold, operator: val }]
                            })}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value=">">{'>'} Greater than</SelectItem>
                                <SelectItem value="<">{'<'} Less than</SelectItem>
                                <SelectItem value=">=">{'>='} Greater or equal</SelectItem>
                                <SelectItem value="<=">{'<='} Less or equal</SelectItem>
                                <SelectItem value="=">{'='} Equals</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-rose-400">Value</Label>
                        <Input
                            type="number"
                            className="bg-slate-900 border-slate-700 focus:border-rose-500"
                            value={threshold.value}
                            onChange={(e) => handleUpdate({
                                thresholds: [{ ...threshold, value: parseFloat(e.target.value) || 0 }]
                            })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (type === AutomationType.TREND) {
        return (
            <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <p className="text-xs text-fuchsia-400 italic">Detect patterns and anomalies over a time window.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-fuchsia-400">Time Range</Label>
                        <Select
                            value={config.timeRange || '7d'}
                            onValueChange={(val) => handleUpdate({ timeRange: val })}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="24h">Last 24 Hours</SelectItem>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="30d">Last 30 Days</SelectItem>
                                <SelectItem value="90d">Last 90 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-fuchsia-400">Metrics to Watch (comma separated)</Label>
                        <Input
                            placeholder="e.g. revenue, users, latency"
                            className="bg-slate-900 border-slate-700 focus:border-fuchsia-500"
                            value={config.metrics?.join(', ') || ''}
                            onChange={(e) => handleUpdate({ metrics: e.target.value.split(',').map(s => s.trim()) })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return <div className="p-10 text-center text-slate-500 italic">Configuration for this type is not yet available.</div>;
}
