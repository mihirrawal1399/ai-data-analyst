import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';

export class RunQueryDto {
    @IsString()
    @IsNotEmpty()
    datasetId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(500)
    question: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    limit?: number;

    @IsOptional()
    @IsString()
    userApiKey?: string; // For BYOK (future use)
}
