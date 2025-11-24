import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDatasetDto } from './dto/upload-dataset.dto';
import { DatasetsService } from './datasets.service';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadDataset(
    @Body() body: UploadDatasetDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.datasetsService.handleUpload(body, file);
  }
}
