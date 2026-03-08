import { Expose, Type } from 'class-transformer';
import { ResponseTableDto } from '../table/response-table.dto';
import { ResponseDtoHelper } from '../../../../shared/database/dtos/database.response.dto';

export class ResponseTableZoneDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  @Type(() => ResponseTableDto)
  tables: ResponseTableDto[];
}
