import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductFamilyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  pictureId?: number;
}
