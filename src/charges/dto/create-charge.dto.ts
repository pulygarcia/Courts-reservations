import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  price: number;
}
