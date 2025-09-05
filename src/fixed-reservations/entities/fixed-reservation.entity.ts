
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Court } from 'src/courts/entities/court.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class FixedReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Court, (court) => court.fixedReservations)
  court: Court;

  @ManyToOne(() => User, (user) => user.fixedReservations)
  user: User;

  @Column()
  dayOfWeek: number; // 0 = sunday, 1 = monday ...

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}
