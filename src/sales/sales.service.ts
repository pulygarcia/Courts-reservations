import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Charge } from 'src/charges/entities/charge.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Sale) private readonly salesRepository: Repository<Sale>,
    @InjectRepository(Charge) private readonly chargesRepository: Repository<Charge>,
    @InjectRepository(SaleItem) private readonly saleItemRepository: Repository<SaleItem>,
  ){}

  private async ensureAdmin(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user?.admin) {
      throw new UnauthorizedException('No autorizado');
    }
  }

  async create(createSaleDto: CreateSaleDto, userId:number) {
    await this.ensureAdmin(userId);

    const saleItems: SaleItem[] = [];

    for (const i of createSaleDto.items) {
      const item = await this.chargesRepository.findOneBy({ id: i.itemId });
      if (!item) throw new NotFoundException(`Item ${i.itemId} no encontrado`);

      const quantity = i.quantity?? 1;
      if(item.stock != null && item.stock < quantity){
        throw new BadRequestException(`No hay suficiente stock para ${item.name}`);
      }

      const saleItem = await this.saleItemRepository.create({
        item,
        quantity,
        price: item.price,
      });

      saleItems.push(saleItem);

      if(item.stock != null){
        item.stock = item.stock - quantity;
        await this.chargesRepository.save(item)
      }
    }

    const total = saleItems.reduce((acc, s) => acc + Number(s.price) * s.quantity, 0);

    //save sale
    const sale = this.salesRepository.create({
      user: {id: userId},
      items: saleItems,
      total,
    });
    await this.salesRepository.save(sale);

    return {
      message: 'Venta registrada correctamente',
      sale,
    };
  }

  async findAll(userId:number) {
    await this.ensureAdmin(userId);

    return await this.salesRepository.find({relations:['user', 'items']});
  }

  async findOne(id: number, userId:number) {
    await this.ensureAdmin(userId)
    return await this.salesRepository.findOne(
      {
        where: {id},
        relations:['user', 'items']
      }
    )
  }

  async remove(id: number, userId:number) {
    await this.ensureAdmin(userId)
    return await this.salesRepository.delete(id)
  }
}
