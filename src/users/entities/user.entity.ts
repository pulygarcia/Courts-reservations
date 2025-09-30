import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { FixedReservation } from 'src/fixed-reservations/entities/fixed-reservation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  admin?: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => FixedReservation, (fixed) => fixed.user)
  fixedReservations: FixedReservation[];
}
