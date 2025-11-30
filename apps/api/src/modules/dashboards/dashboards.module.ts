import { Module } from '@nestjs/common';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';
import { PrismaService } from 'src/db/prisma.service';
import { ChartsModule } from '../charts/charts.module';

@Module({
    imports: [ChartsModule],
    controllers: [DashboardsController],
    providers: [DashboardsService, PrismaService],
})
export class DashboardsModule { }
