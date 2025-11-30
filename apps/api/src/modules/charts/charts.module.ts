import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';
import { PrismaService } from 'src/db/prisma.service';
import { McpModule } from '../mcp/mcp.module';

@Module({
    imports: [McpModule],
    controllers: [ChartsController],
    providers: [ChartsService, PrismaService],
    exports: [ChartsService],
})
export class ChartsModule { }
