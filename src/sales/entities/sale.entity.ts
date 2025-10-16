import { User } from "src/users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { SaleItem } from "./sale-item.entity";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.sale, {
    cascade: true,
  })
  items: SaleItem[];

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sales, {nullable: false})
  user: User;
}
