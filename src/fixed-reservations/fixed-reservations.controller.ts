import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FixedReservationsService } from './fixed-reservations.service';
import { CreateFixedReservationDto } from './dto/create-fixed-reservation.dto';
import { UpdateFixedReservationDto } from './dto/update-fixed-reservation.dto';
import { JwtAuthGuard } from 'src/users/jwt-guard';

@Controller('fixed-reservations')
export class FixedReservationsController {
  constructor(private readonly fixedReservationsService: FixedReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFixedReservationDto: CreateFixedReservationDto, @Req() req) {
    const user = req.user.id; //get from jwt
    return this.fixedReservationsService.create(createFixedReservationDto, user);
  }

  @Get()
  findAll() {
    return this.fixedReservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fixedReservationsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFixedReservationDto: UpdateFixedReservationDto, @Req() req) {
    const user = req.user.id;
    return this.fixedReservationsService.update(+id, updateFixedReservationDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fixedReservationsService.remove(+id);
  }
}
