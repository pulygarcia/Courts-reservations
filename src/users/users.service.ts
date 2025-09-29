import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { LoginUserDto } from './dto/login-dto';
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
            throw new BadRequestException('Ya existe un usuario registrado con ese email');
        }

        const user = this.usersRepository.create(createUserDto);

        const saltRounds = 10;
        user.password = await bcrypt.hash(createUserDto.password, saltRounds);

        return await this.usersRepository.save(user);
    }
    
    async login(loginUserDto: LoginUserDto){
        const existingUser = await this.usersRepository.findOneBy({ email: loginUserDto.email });
        if (!existingUser) {
            throw new NotFoundException(`No se encontró ningun usuario registrado con el correo ${loginUserDto.email}`);
        }

        const correctPassword = await bcrypt.compare(loginUserDto.password, existingUser.password);
        if(!correctPassword){
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        const payload = { sub: existingUser.id, email: existingUser.email};

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async findOne(id: number){
        const user = await this.usersRepository.findOne({
            where: {id},
            relations: ['reservations', 'reservations.court', 'fixedReservations']
        });
        if (!user) {
            throw new NotFoundException(`No se encontró ningun usuario registrado con el id ${id}`);
        }

        //get date in format YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];

        //filter expired reservations
        const upcomingReservations = user.reservations.filter(
            (res) => res.date >= today
        );

        return {...user, reservations: upcomingReservations}
    }
}
