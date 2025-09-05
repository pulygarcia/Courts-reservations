import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedReservation } from 'src/fixed-reservations/entities/fixed-reservation.entity';
import { Court } from 'src/courts/entities/court.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Reservation, FixedReservation, Court]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
