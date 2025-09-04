import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsOptional, IsInt, Min, IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsInt({ message: 'El ID de la cancha debe ser un número' })
  @Min(1)
  courtId?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser válida con el siguiente formato:(YYYY-MM-DD)' })
  date?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  startTime?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  endTime?: string;
}
