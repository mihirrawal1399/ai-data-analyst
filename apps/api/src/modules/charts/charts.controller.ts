import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ChartsService } from './charts.service';

@Controller('charts')
export class ChartsController {
    constructor(private readonly chartsService: ChartsService) { }

    @Post()
    async create(@Body() body: { dashboardId: string; title?: string; type: string; config: any }) {
        return this.chartsService.create(body);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.chartsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: { title?: string; type?: string; config?: any }) {
        return this.chartsService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.chartsService.remove(id);
    }
}
