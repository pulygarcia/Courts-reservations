import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { FixedReservation } from 'src/fixed-reservations/entities/fixed-reservation.entity';

@Entity()
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Ej: "Cancha 1"

  @OneToMany(() => Reservation, (reservation) => reservation.court)
  reservations: Reservation[];

  @OneToMany(() => FixedReservation, (fixed) => fixed.court)
  fixedReservations: FixedReservation[];
}
