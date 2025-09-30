import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { JwtAuthGuard } from 'src/users/jwt-guard';

@Controller('charges')
export class ChargesController {
  constructor(
    private readonly chargesService: ChargesService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChargeDto: CreateChargeDto, @Req() req) {
    const user = req.user.id;
    return this.chargesService.create(createChargeDto, user);
  }

  @Get()
  findAll() {
    return this.chargesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chargesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChargeDto: UpdateChargeDto, @Req() req) {
    const user = req.user.id;
    return this.chargesService.update(+id, updateChargeDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,  @Req() req) {
    const user = req.user.id;
    return this.chargesService.remove(+id, user);
  }
}
