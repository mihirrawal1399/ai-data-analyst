import { Controller, Get, Delete, Param } from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @Get()
    async findAll() {
        return this.tablesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tablesService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.tablesService.remove(id);
    }
}
