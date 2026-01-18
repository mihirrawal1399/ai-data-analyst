import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DEMO_DATASET_ID } from '@repo/shared-types/demo';

export const ALLOW_GUEST_KEY = 'allowGuest';
export const AllowGuest = () => SetMetadata(ALLOW_GUEST_KEY, true);

/**
 * GuestRestrictionGuard ensures guest users can only access demo dataset
 */
@Injectable()
export class GuestRestrictionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const allowGuest = this.reflector.get<boolean>(
            ALLOW_GUEST_KEY,
            context.getHandler(),
        );

        // If endpoint explicitly allows guest, skip check
        if (allowGuest) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Only restrict GUEST role users
        if (user?.role !== 'GUEST') {
            return true;
        }

        // For GUEST users, check if they're accessing demo dataset
        const datasetId = request.params?.datasetId || request.body?.datasetId;

        if (datasetId && datasetId !== DEMO_DATASET_ID) {
            throw new ForbiddenException(
                'Guest users can only access the demo dataset. Sign up for free to upload your own data.'
            );
        }

        return true;
    }
}
