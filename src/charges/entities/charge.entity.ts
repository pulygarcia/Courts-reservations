import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Charge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("int")
  price: number;
}
