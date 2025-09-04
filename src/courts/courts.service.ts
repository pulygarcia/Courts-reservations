import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Court } from './entities/court.entity';
import { Repository } from 'typeorm';
import { CreateCourtDto } from './dto/create-court-dto';

@Injectable()
export class CourtsService {
    constructor(
        @InjectRepository(Court)
        private readonly courtsRepository: Repository<Court>,
    ){}

    async create(createCourtDto:CreateCourtDto){
        //only 2 courts in the club are being used
        const count = await this.courtsRepository.count();
        if (count >= 2) {
            throw new BadRequestException(
                'No se pueden crear más de 2 canchas',
            );
        }

        return await this.courtsRepository.save(createCourtDto)
    }

    async getAll(){
        return await this.courtsRepository.find()
    }
}
