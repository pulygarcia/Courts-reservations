import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './entities/dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { LoginUserDto } from './entities/dto/login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ){}

    async create(createUserDto: CreateUserDto){
        const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const user = this.usersRepository.create(createUserDto);

        const saltRounds = 10;
        user.password = await bcrypt.hash(createUserDto.password, saltRounds);

        return await this.usersRepository.save(user);
    }
    
    async login(loginUserDto: LoginUserDto){
        const existingUser = await this.usersRepository.findOneBy({ email: loginUserDto.email });
        if (!existingUser) {
            throw new UnauthorizedException('User with this email does not exist');
        }

        const correctPassword = await bcrypt.compare(loginUserDto.password, existingUser.password);
        if(!correctPassword){
            throw new UnauthorizedException('Wrong password');
        }

        const payload = { sub: existingUser.id, email: existingUser.email};

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
