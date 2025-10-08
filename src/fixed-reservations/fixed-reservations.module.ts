import { Module } from '@nestjs/common';
import { FixedReservationsService } from './fixed-reservations.service';
import { FixedReservationsController } from './fixed-reservations.controller';
import { FixedReservation } from './entities/fixed-reservation.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Court } from 'src/courts/entities/court.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports:[
      TypeOrmModule.forFeature([FixedReservation, Reservation, Court, User]),
    ],
  controllers: [FixedReservationsController],
  providers: [FixedReservationsService],
})
export class FixedReservationsModule {}
