import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { AutomationsService } from './automations.service';

@Controller('automations')
export class AutomationsController {
    constructor(private readonly automationsService: AutomationsService) { }

    @Post()
    async create(@Body() body: { name: string; userId: string; schedule: string; payload?: any }) {
        return this.automationsService.create(body);
    }

    @Get()
    async findAll() {
        return this.automationsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.automationsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: { name?: string; schedule?: string; payload?: any }) {
        return this.automationsService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.automationsService.remove(id);
    }
}
