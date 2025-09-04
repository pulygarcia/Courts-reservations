import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedReservation } from 'src/fixed-reservations/entities/fixed.reservation.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Reservation, FixedReservation]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
