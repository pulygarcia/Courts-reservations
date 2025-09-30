import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeOrmConfig';
import { UsersModule } from './users/users.module';
import { CourtsModule } from './courts/courts.module';
import { ReservationsModule } from './reservations/reservations.module';
import { FixedReservationsModule } from './fixed-reservations/fixed-reservations.module';
import { ChargesModule } from './charges/charges.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService]
    }),
    UsersModule,
    CourtsModule,
    ReservationsModule,
    FixedReservationsModule,
    ChargesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
