import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Charge } from './entities/charge.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChargesService {
  constructor(
    @InjectRepository(Charge)
    private readonly chargeRepository: Repository<Charge>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async ensureAdmin(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user?.admin) {
      throw new UnauthorizedException('No autorizado');
    }
  }

  async create(createChargeDto: CreateChargeDto, userId:number) {
    await this.ensureAdmin(userId);

    const charge = this.chargeRepository.create(createChargeDto);
    await this.chargeRepository.save(charge);
    
    return {
      message: 'Agregado correctamente',
      charge,
    };
  }

  async findAll() {
    return await this.chargeRepository.find();
  }

  async findOne(id: number) {
    return await this.chargeRepository.findOneBy({id});
  }

  async update(id: number, updateChargeDto: UpdateChargeDto, userId:number) {
    await this.ensureAdmin(userId);
    
    const charge = await this.chargeRepository.findOneBy({id})
    if(!charge){
      throw new NotFoundException('Artículo no encontrado')
    }

    if (updateChargeDto.name) charge.name = updateChargeDto.name;
    if (updateChargeDto.price) charge.price = updateChargeDto.price;

    await this.chargeRepository.save(charge);

    return {
      message: 'Artículo modificado correctamente',
      charge
    }
  }

  async remove(id: number, userId:number) {
    await this.ensureAdmin(userId);
    
    const charge = await this.chargeRepository.findOneBy({id})
    if(!charge){
      throw new NotFoundException('Artículo no encontrado')
    }

    await this.chargeRepository.remove(charge)
    return {
      message: 'Artículo eliminado correctamente',
      charge
    }
  }
}
