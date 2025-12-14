import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdateAutomationDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    schedule?: string;

    @IsObject()
    @IsOptional()
    config?: any;

    @IsBoolean()
    @IsOptional()
    enabled?: boolean;
}
