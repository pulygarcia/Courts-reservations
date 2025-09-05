import { PartialType } from '@nestjs/mapped-types';
import { CreateFixedReservationDto } from './create-fixed-reservation.dto';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class UpdateFixedReservationDto extends PartialType(CreateFixedReservationDto) {
    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    courtId: number;

    // 0 = sunday, 1 = monday...
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @IsOptional()
    @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
    startTime: string; //HH:MM

    @IsOptional()
    @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
    endTime: string; //HH:MM
}
