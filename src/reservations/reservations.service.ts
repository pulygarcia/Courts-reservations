import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { FixedReservation } from 'src/fixed-reservations/entities/fixed.reservation.entity';
import { isBefore, parse } from 'date-fns';
import { Court } from 'src/courts/entities/court.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(FixedReservation) private readonly fixedReservationRepo: Repository<FixedReservation>,
    @InjectRepository(Court) private readonly courtRepo: Repository<Court>,
  ){}

  async create(createReservationDto: CreateReservationDto, user: number) {
    //Transform startTime y endTime to Date object
    const start = parse(`${createReservationDto.date} ${createReservationDto.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const end = parse(`${createReservationDto.date} ${createReservationDto.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

    if(!isBefore(start, end)){ //check start time selected not to be > than end time 
      throw new BadRequestException('La hora de fin debe ser mayor que la de inicio');
    }

    //Control/check conflicts with other NORMAL reservations...
    const overlappingReservation = await this.reservationRepo.findOne({
      where: [
        {
          court: { id: createReservationDto.courtId },
          date: createReservationDto.date,
          startTime: LessThan(createReservationDto.endTime),
          endTime: MoreThan(createReservationDto.startTime),
        },
      ],
    });
    if (overlappingReservation) {
      throw new BadRequestException('El horario ya está ocupado por otra reserva');
    }

    //Control/check conflicts with FIXED reservations
    const dayOfWeek = start.getDay();//0:sunday, 1:monday...
    const overlappingFixedReservation = await this.fixedReservationRepo.findOne({
      where: [
        {
          court: { id: createReservationDto.courtId },
          dayOfWeek,
          startTime: LessThan(createReservationDto.endTime),
          endTime: MoreThan(createReservationDto.startTime),
        },
      ],
    });
    if (overlappingFixedReservation) {
      throw new BadRequestException('El horario ya está ocupado por una reserva fija');
    }

    const reservation = this.reservationRepo.create({
      ...createReservationDto,
      court: {id: createReservationDto.courtId}, //typeorm expect court as an object (with the id value)
      //send the user too
      user: {id: user} //<--received from controller
    })
    return await this.reservationRepo.save(reservation);
  }

  async findAll() {
    return await this.reservationRepo.find({relations: ['court']});
  }

  async findOne(id: number) {
    return await this.reservationRepo.findOne(
      {
        where: {id},
        relations: ['court']
      }
    );
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationRepo.findOne({
      where: {id},
      relations: ['court']
    })

    if(!reservation){
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    if(updateReservationDto.courtId){
      const court = await this.courtRepo.findOne({
        where: {id: updateReservationDto.courtId},
      })

      if(!court){
        throw new NotFoundException(`Court with ID ${id} not found`);
      }
      
      reservation.court = court;
    }

    if (updateReservationDto.date) reservation.date = updateReservationDto.date;
    if (updateReservationDto.startTime) reservation.startTime = updateReservationDto.startTime;
    if (updateReservationDto.endTime) reservation.endTime = updateReservationDto.endTime;

    //avoid time conflicts with other reservations
    const overlapping = await this.reservationRepo.findOne({
      where: {
        court: { id: reservation.court.id },
        date: reservation.date,
        id: Not(reservation.id), // ignore same reservation usinsg NOT
        startTime: LessThan(reservation.endTime),
        endTime: MoreThan(reservation.startTime),
      },
      relations: ['court'],
    });

    if (overlapping) {
      throw new BadRequestException('Ya existe una reserva en ese horario');
    }

    //all ok
    return this.reservationRepo.save(reservation);
  }

  async remove(id: number) {
    const reservation = await this.reservationRepo.findOne({
      where: {id},
    })

    if(!reservation){
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return this.reservationRepo.remove(reservation)
  }
}
