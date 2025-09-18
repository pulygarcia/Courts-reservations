import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFixedReservationDto } from './dto/create-fixed-reservation.dto';
import { UpdateFixedReservationDto } from './dto/update-fixed-reservation.dto';
import { getDay, isBefore, parse } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { FixedReservation } from './entities/fixed-reservation.entity';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Court } from 'src/courts/entities/court.entity';

@Injectable()
export class FixedReservationsService {
  constructor(
    @InjectRepository(FixedReservation) private readonly fixedReservationRepo:Repository<FixedReservation>,
    @InjectRepository(Reservation) private readonly reservationRepo:Repository<Reservation>,
    @InjectRepository(Court) private readonly courtRepo:Repository<Court>,
  ){}

  async create(createFixedReservationDto: CreateFixedReservationDto, user:number) {
    //Transform startTime y endTime to Date object
    const fillingDate = '2025-01-01';//filling date to compare hours in correct format
    const start = parse(`${fillingDate} ${createFixedReservationDto.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const end = parse(`${fillingDate} ${createFixedReservationDto.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

    if (!isBefore(start, end)) {
      throw new BadRequestException('La hora de fin debe ser mayor que la de inicio');
    }

    if (!user) {
      throw new ForbiddenException('No tienes permiso para crear esta reserva');
    }

    //Control/check conflicts with other FIXED reservations...
    const overlappingFixed = await this.fixedReservationRepo.findOne({
      where: {
        court: { id: createFixedReservationDto.courtId },
        dayOfWeek: createFixedReservationDto.dayOfWeek,
        startTime: LessThan(createFixedReservationDto.endTime),
        endTime: MoreThan(createFixedReservationDto.startTime),
      },
    });
    if (overlappingFixed) {
      throw new BadRequestException('Ya existe una reserva fija en ese horario');
    }

    //Control/check conflicts with other NORMAL reservations...
    //Get all normal reservations for the same court that overlap in TIME
    const allNormals = await this.reservationRepo.find({
      where: {
        court: { id: createFixedReservationDto.courtId },
        startTime: LessThan(createFixedReservationDto.endTime),
        endTime: MoreThan(createFixedReservationDto.startTime),
      },
    });
    //Filter normal reservations that occur on the same DAY (0, 1...) of the week
    const overlappingNormal = allNormals.find((reservation) => {
      // reservation.date comes "YYYY-MM-DD" (DATE without hour in DB)
      const [year, month, day] = reservation.date.toString().split('-').map(Number);
      const reservationDay = new Date(year, month - 1, day).getDay(); // without timezone

      return reservationDay === createFixedReservationDto.dayOfWeek;
    });

    if (overlappingNormal) {
      throw new BadRequestException('Ese horario ya está ocupado por una reserva normal');
    }

    const reservation = this.fixedReservationRepo.create({
      ...createFixedReservationDto,
      court: {id: createFixedReservationDto.courtId}, //typeorm expect court as an object (with the id value)
      //send the user too
      user: {id: user} //<--received from controller
    })

    await this.fixedReservationRepo.save(reservation);
    return{
      message: 'Reserva creada correctamente',
      reservation
    }
  }

  async findAll() {
    return await this.fixedReservationRepo.find({relations: ['court']})
  }

  async findOne(id: number) {
    const reservation = await this.fixedReservationRepo.findOne(
      {
        where: {id},
        relations: ['court']
      }
    );

    if(!reservation){
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`)
    }

    return reservation
  }

  async update(id: number, updateFixedReservationDto: UpdateFixedReservationDto, user:number) {
    const reservation = await this.fixedReservationRepo.findOne(
      {
        where: {id},
        relations: ['court', 'user']
      }
    );
    if(!reservation){
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`)
    }

    if(updateFixedReservationDto.courtId){
      const court = await this.courtRepo.findOne({
        where: {id: updateFixedReservationDto.courtId},
      })

      if(!court){
        throw new NotFoundException(`Cancha con ID ${id} no encontrada`);
      }
      
      reservation.court = court;
    }

    if (!reservation.user || reservation.user.id !== user) {
      throw new ForbiddenException('No tienes permiso para modificar esta reserva');
    }

    if (updateFixedReservationDto.startTime && updateFixedReservationDto.endTime) {
      if (updateFixedReservationDto.startTime >= updateFixedReservationDto.endTime) {
        throw new BadRequestException('El tiempo de finalización debe ser mayor al de inicio');
      }
    }

    if (updateFixedReservationDto.dayOfWeek) reservation.dayOfWeek = updateFixedReservationDto.dayOfWeek;
    if (updateFixedReservationDto.startTime) reservation.startTime = updateFixedReservationDto.startTime;
    if (updateFixedReservationDto.endTime) reservation.endTime = updateFixedReservationDto.endTime;

    const allNormals = await this.reservationRepo.find({
      where: {
        court: { id: updateFixedReservationDto.courtId },
        startTime: LessThan(updateFixedReservationDto.endTime),
        endTime: MoreThan(updateFixedReservationDto.startTime),
      },
    });
    
    const overlappingNormal = allNormals.find((reservation) => {
      const [year, month, day] = reservation.date.toString().split('-').map(Number);
      const reservationDay = new Date(year, month - 1, day).getDay();

      return reservationDay === updateFixedReservationDto.dayOfWeek;
    });

    if (overlappingNormal) {
      throw new BadRequestException('Ese horario ya está ocupado por una reserva normal');
    }

    const overlappingFixed = await this.fixedReservationRepo.findOne({
      where: {
        id: Not(id), // exclude same reservation
        court: { id: updateFixedReservationDto.courtId },
        dayOfWeek:updateFixedReservationDto.dayOfWeek,
        startTime: LessThan(updateFixedReservationDto.endTime),
        endTime: MoreThan(updateFixedReservationDto.startTime),
      },
    });

    if (overlappingFixed) {
      throw new BadRequestException('Este horario ya está tomado por otra reserva fija');
    }


    await this.fixedReservationRepo.save(reservation);
    return{
      message: 'Reserva modificada correctamente',
      reservation
    }
  }

  async remove(id: number) {
    const reservation = await this.fixedReservationRepo.findOne(
      {
        where: {id},
      }
    );
    if(!reservation){
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`)
    }

    await this.fixedReservationRepo.remove(reservation);
    return{
      message: 'Reserva eliminada correctamente',
      reservation
    }
  }
}
