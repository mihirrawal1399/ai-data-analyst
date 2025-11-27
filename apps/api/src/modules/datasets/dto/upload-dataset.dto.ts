import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UploadDatasetDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
