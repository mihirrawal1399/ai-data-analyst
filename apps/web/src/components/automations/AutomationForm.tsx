'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AutomationType, AutomationConfig } from '@repo/shared-types/automation';
import { AutomationConfigForm } from './AutomationConfigForm';
import { SchedulePreview } from './SchedulePreview';
import { useCreateAutomation } from '@/lib/api/automation-queries';
import { toast } from 'sonner';
import { Sparkles, Save, X } from 'lucide-react';

interface AutomationFormProps {
    userId: string;
    datasets: any[];
    dashboards: any[];
}

export function AutomationForm({ userId, datasets, dashboards }: AutomationFormProps) {
    const router = useRouter();
    const createMutation = useCreateAutomation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<AutomationType>(AutomationType.SUMMARY);
    const [schedule, setSchedule] = useState('0 9 * * *');
    const [datasetId, setDatasetId] = useState<string>('');
    const [dashboardId, setDashboardId] = useState<string>('');
    const [config, setConfig] = useState<AutomationConfig>({
        emailFormat: 'html',
        recipients: [],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !schedule || (!datasetId && !dashboardId)) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await createMutation.mutateAsync({
                userId,
                name,
                description,
                type,
                schedule,
                datasetId: datasetId || undefined,
                dashboardId: dashboardId || undefined,
                config,
            });
            toast.success('Automation created successfully!');
            router.push('/automations');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create automation');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl border-t-cyan-500/20 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-cyan-400">
                                <Sparkles className="w-5 h-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Automation Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Daily Revenue Summary"
                                        className="bg-black/40 border-slate-700 focus:border-cyan-500"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Automation Type *</Label>
                                    <Select value={type} onValueChange={(val: any) => setType(val)}>
                                        <SelectTrigger className="bg-black/40 border-slate-700">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value={AutomationType.SUMMARY}>Summary Report</SelectItem>
                                            <SelectItem value={AutomationType.ALERT}>Smart Alert</SelectItem>
                                            <SelectItem value={AutomationType.TREND}>Trend Analysis</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="What does this automation do?"
                                    className="bg-black/40 border-slate-700 focus:border-cyan-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="dataset">Source Dataset</Label>
                                    <Select value={datasetId} onValueChange={setDatasetId}>
                                        <SelectTrigger className="bg-black/40 border-slate-700">
                                            <SelectValue placeholder="Select dataset" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            {datasets.map(ds => (
                                                <SelectItem key={ds.id} value={ds.id}>{ds.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dashboard">Target Dashboard (Optional)</Label>
                                    <Select value={dashboardId} onValueChange={setDashboardId}>
                                        <SelectTrigger className="bg-black/40 border-slate-700">
                                            <SelectValue placeholder="None" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value="">None</SelectItem>
                                            {dashboards.map(db => (
                                                <SelectItem key={db.id} value={db.id}>{db.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl border-t-fuchsia-500/20 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-fuchsia-400">
                                <Rocket className="w-5 h-5" />
                                Execution Logic
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AutomationConfigForm
                                type={type}
                                config={config}
                                onChange={setConfig}
                                datasets={datasets}
                                dashboards={dashboards}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl border-t-cyan-500/20 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-mono text-cyan-500 uppercase tracking-widest">Scheduling</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="schedule">Cron Expression</Label>
                                <Input
                                    id="schedule"
                                    placeholder="* * * * *"
                                    className="bg-black/40 border-slate-700 focus:border-fuchsia-500 font-mono"
                                    value={schedule}
                                    onChange={(e) => setSchedule(e.target.value)}
                                    required
                                />
                                <p className="text-[10px] text-slate-500">
                                    Standard cron format: [min] [hour] [day] [month] [weekday]
                                </p>
                            </div>

                            <SchedulePreview schedule={schedule} />
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 h-12 font-bold shadow-xl shadow-cyan-500/20"
                            disabled={createMutation.isPending}
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Create Automation
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-slate-800 hover:bg-slate-800"
                            onClick={() => router.back()}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
