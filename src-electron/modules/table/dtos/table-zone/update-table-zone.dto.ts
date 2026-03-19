import { PartialType } from '@nestjs/mapped-types';
import { CreateTableZoneDto } from './create-table-zone.dto';

export class UpdatetableZoneDto extends PartialType(CreateTableZoneDto) {}
