import { cn } from '@/lib/utils/cn';

interface GradientDividerProps {
    className?: string;
}

export function GradientDivider({ className }: GradientDividerProps) {
    return (
        <div
            className={cn(
                'h-px bg-gradient-to-r from-transparent via-primary-1 to-transparent',
                className
            )}
        />
    );
}
