import { ChartSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="h-10 w-64 bg-surface animate-pulse rounded mb-2" />
                <div className="h-6 w-48 bg-surface animate-pulse rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass-surface rounded-lg p-6">
                        <ChartSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}
