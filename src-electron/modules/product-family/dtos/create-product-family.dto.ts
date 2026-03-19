import { IsString } from 'class-validator';

export class CreateProductFamilyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
