import { Controller, Get, Param } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) { }

    @Get('table/:tableId')
    async findByTable(@Param('tableId') tableId: string) {
        return this.columnsService.findByTable(tableId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.columnsService.findOne(id);
    }
}
