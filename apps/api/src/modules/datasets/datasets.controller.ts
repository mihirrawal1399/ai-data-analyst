import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { UploadDatasetDto } from './dto/upload-dataset.dto';
import { DatasetsService } from './datasets.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard, Roles } from '../../guards/role.guard';
import { QuotaGuard, QuotaResource } from '../../guards/quota.guard';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) { }

  @Post('upload')
  @UseGuards(AuthGuard, RoleGuard, QuotaGuard)
  @Roles('FREE', 'PAID', 'PREMIUM', 'ENTERPRISE')
  @QuotaResource('datasets')
  async uploadDataset(
    @Body() body: UploadDatasetDto,
    @Req() req: FastifyRequest,
  ) {
    const file = await req.file();
    if (!file) {
      throw new Error('File is required');
    }
    const buffer = await file.toBuffer();
    return this.datasetsService.handleUpload(
      { name: body.name, userId: body.userId },
      { buffer },
    );
  }
}
