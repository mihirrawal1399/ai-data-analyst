import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-surface',
                variant === 'text' && 'h-4 rounded',
                variant === 'rect' && 'rounded-lg',
                variant === 'circle' && 'rounded-full',
                className
            )}
        />
    );
}

export function ChartSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-48" variant="text" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
}
