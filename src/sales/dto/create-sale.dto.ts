import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsInt, Min, IsString } from 'class-validator';

export class CreateSaleItemDto {
  @IsInt()
  itemId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}

