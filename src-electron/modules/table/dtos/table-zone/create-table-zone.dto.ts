import { IsNumber, IsString } from 'class-validator';

export class CreateTableZoneDto {
  @IsString()
  name: string;
}
