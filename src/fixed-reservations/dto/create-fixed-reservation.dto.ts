import { IsInt, IsNotEmpty, IsString, Matches, Min, Max } from 'class-validator';

export class CreateFixedReservationDto {
  @IsInt()
  @IsNotEmpty()
  courtId: number;

  // 0 = sunday, 1 = monday...
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  startTime: string; //HH:MM

  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  endTime: string; //HH:MM
}

