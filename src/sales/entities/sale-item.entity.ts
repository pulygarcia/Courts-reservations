import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Sale } from './sale.entity';
import { Charge } from 'src/charges/entities/charge.entity';

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.items)
  sale: Sale;

  @ManyToOne(() => Charge)
  item: Charge;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
