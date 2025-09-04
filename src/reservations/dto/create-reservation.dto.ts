import { IsNotEmpty, IsDateString, IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt({ message: 'El ID de la cancha debe ser un número' })
  @Min(1)
  courtId: number;

  @IsDateString({}, { message: 'La fecha debe ser válida con el siguiente formato: (YYYY-MM-DD)' })
  date: string;

  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  startTime: string; //HH:MM

  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  endTime: string; //HH:MM
}

