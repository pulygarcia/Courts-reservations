import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court-dto';

@Controller('courts')
export class CourtsController {
    constructor(
        private readonly courtsService: CourtsService
    ){}

    @Post()
    create(@Body() createCourtDto: CreateCourtDto) {
        return this.courtsService.create(createCourtDto)
    }

    @Get()
    findAll() {
        return this.courtsService.getAll()
    }
}
