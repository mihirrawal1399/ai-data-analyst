import { IsString, IsNotEmpty, IsOptional, IsObject, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { ChartType, ChartConfig, ChartFilter } from '@repo/shared-types';

export class ChartFilterDto implements ChartFilter {
    @IsString()
    @IsNotEmpty()
    column: string;

    @IsString()
    @IsNotEmpty()
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';

    @IsNotEmpty()
    value: any;
}

export class ChartConfigDto implements ChartConfig {
    @IsString()
    @IsNotEmpty()
    datasetId: string;

    @IsString()
    @IsNotEmpty()
    xAxis: string;

    @IsString()
    @IsNotEmpty()
    yAxis: string;

    @IsString()
    @IsOptional()
    groupBy?: string;

    @ValidateNested({ each: true })
    @Type(() => ChartFilterDto)
    @IsOptional()
    filters?: ChartFilterDto[];

    @IsString()
    @IsOptional()
    orderBy?: string;

    @IsString()
    @IsOptional()
    orderDirection?: 'ASC' | 'DESC';

    @IsOptional()
    limit?: number;
}

export class CreateChartDto {
    @IsString()
    @IsNotEmpty()
    dashboardId: string;

    @IsString()
    @IsNotEmpty()
    datasetId: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsEnum(['line', 'bar', 'pie', 'scatter'])
    @IsNotEmpty()
    type: ChartType;

    @ValidateNested()
    @Type(() => ChartConfigDto)
    @IsObject()
    config: ChartConfigDto;
}

export class UpdateChartDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsEnum(['line', 'bar', 'pie', 'scatter'])
    @IsOptional()
    type?: ChartType;

    @ValidateNested()
    @Type(() => ChartConfigDto)
    @IsObject()
    @IsOptional()
    config?: ChartConfigDto;
}
