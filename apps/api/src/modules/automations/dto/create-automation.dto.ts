import { IsString, IsOptional, IsBoolean, IsEnum, IsObject } from 'class-validator';
import { AutomationType } from '@repo/shared-types/automation';

export class CreateAutomationDto {
    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    dashboardId?: string;

    @IsString()
    @IsOptional()
    datasetId?: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    schedule: string;

    @IsEnum(AutomationType)
    type: AutomationType;

    @IsObject()
    config: any;

    @IsBoolean()
    @IsOptional()
    enabled?: boolean;
}
