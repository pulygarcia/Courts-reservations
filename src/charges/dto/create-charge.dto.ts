import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(500)
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock: number;
}
