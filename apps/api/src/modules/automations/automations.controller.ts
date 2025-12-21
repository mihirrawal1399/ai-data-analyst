import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@Controller('automations')
export class AutomationsController {
    constructor(private service: AutomationsService) { }

    @Post()
    create(@Body() dto: CreateAutomationDto) {
        return this.service.createAutomation(dto);
    }

    @Get()
    findAll(@Query('userId') userId: string) {
        return this.service.findAll(userId);
    }

    @Get('due')
    getDue() {
        return this.service.getDueAutomations();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateAutomationDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    @Post(':id/execute')
    async execute(@Param('id') id: string) {
        const automation = await this.service.findOne(id);
        return this.service.executeAutomation(automation);
    }

    @Get(':id/results')
    async getResults(@Param('id') id: string, @Query('limit') limit?: string) {
        return this.service.getAutomationResults(id, limit ? parseInt(limit) : undefined);
    }
}
