import { Module } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsController } from './courts.controller';
import { Court } from './entities/court.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Court]),
  ],
  providers: [CourtsService],
  controllers: [CourtsController],
})
export class CourtsModule {}
