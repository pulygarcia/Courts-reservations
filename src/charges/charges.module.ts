import { Module } from '@nestjs/common';
import { ChargesService } from './charges.service';
import { ChargesController } from './charges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Charge } from './entities/charge.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Charge, User]),
  ],
  controllers: [ChargesController],
  providers: [ChargesService],
})
export class ChargesModule {}
