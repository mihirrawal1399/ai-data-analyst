import { Controller, Post, Get, Put, Delete, Body, Param, Query, ParseBoolPipe, UseGuards } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { CreateChartDto, UpdateChartDto } from './dto/chart.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { QuotaGuard, QuotaResource } from '../../guards/quota.guard';

@Controller('charts')
@UseGuards(AuthGuard) // All chart routes require auth
export class ChartsController {
    constructor(private readonly chartsService: ChartsService) { }

    @Post()
    @UseGuards(QuotaGuard)
    @QuotaResource('charts')
    async create(@Body() body: CreateChartDto) {
        return this.chartsService.create(body);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Query('includeData', new ParseBoolPipe({ optional: true })) includeData?: boolean
    ) {
        return this.chartsService.findOne(id, includeData || false);
    }

    @Get(':id/data')
    async getChartData(@Param('id') id: string) {
        return this.chartsService.executeChartQuery(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateChartDto) {
        return this.chartsService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.chartsService.remove(id);
    }

    @Put(':id/refresh')
    async refreshChartData(@Param('id') id: string) {
        return this.chartsService.executeChartQuery(id);
    }
}

