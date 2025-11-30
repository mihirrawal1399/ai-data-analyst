import { Controller, Post, Get, Put, Delete, Body, Param, Query, ParseBoolPipe } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';

@Controller('dashboards')
export class DashboardsController {
    constructor(private readonly dashboardsService: DashboardsService) { }

    @Post()
    async create(@Body() body: { name: string; userId: string; layout?: any }) {
        return this.dashboardsService.create(body);
    }

    @Get()
    async findAll() {
        return this.dashboardsService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Query('includeData', new ParseBoolPipe({ optional: true })) includeData?: boolean
    ) {
        if (includeData) {
            return this.dashboardsService.findOneWithData(id);
        }
        return this.dashboardsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: { name?: string; layout?: any }) {
        return this.dashboardsService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.dashboardsService.remove(id);
    }
}
