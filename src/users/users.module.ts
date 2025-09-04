import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/users/jwt-strategy';

@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '60d' },
            }),
        })
    ],
    providers: [JwtStrategy,UsersService],
    controllers: [UsersController],
    exports: [JwtModule, PassportModule]
})
export class UsersModule {}
