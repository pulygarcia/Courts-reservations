import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Charge } from 'src/charges/entities/charge.entity';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Charge, Sale, SaleItem]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
