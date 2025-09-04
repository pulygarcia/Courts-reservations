import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'El nombre no puede superar los 20 caracteres' })
  name: string;
}