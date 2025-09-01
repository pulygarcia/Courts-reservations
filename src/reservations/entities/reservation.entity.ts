import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Court } from 'src/courts/entities/court.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Court, (court) => court.reservations)
  court: Court;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @Column({ type: 'date' })
  date: string; 

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}
