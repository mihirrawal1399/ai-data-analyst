import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../db/prisma.service';
import { getQuotaForRole, UserRole } from '@repo/shared-types/quotas';

export const QUOTA_RESOURCE_KEY = 'quotaResource';
export const QuotaResource = (resource: 'datasets' | 'charts' | 'dashboards' | 'automations') =>
    SetMetadata(QUOTA_RESOURCE_KEY, resource);

/**
 * QuotaGuard enforces usage limits based on user role
 * Use with @QuotaResource('datasets') decorator
 */
@Injectable()
export class QuotaGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const resourceType = this.reflector.get<string>(
            QUOTA_RESOURCE_KEY,
            context.getHandler(),
        );

        if (!resourceType) {
            return true; // No quota check needed
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('User not authenticated');
        }

        const quota = getQuotaForRole(user.role as UserRole);
        const limit = quota[resourceType];

        // Unlimited access for enterprise
        if (limit === -1) {
            return true;
        }

        // Count current usage
        let currentCount = 0;

        switch (resourceType) {
            case 'datasets':
                currentCount = await this.prisma.dataset.count({
                    where: { userId: user.id },
                });
                break;
            case 'charts':
                currentCount = await this.prisma.chart.count({
                    where: { dashboard: { userId: user.id } },
                });
                break;
            case 'dashboards':
                currentCount = await this.prisma.dashboard.count({
                    where: { userId: user.id },
                });
                break;
            case 'automations':
                currentCount = await this.prisma.automation.count({
                    where: { userId: user.id },
                });
                break;
        }

        if (currentCount >= limit) {
            throw new ForbiddenException(
                `Quota exceeded: You have reached your limit of ${limit} ${resourceType}. Upgrade your plan to unlock more.`
            );
        }

        return true;
    }
}
