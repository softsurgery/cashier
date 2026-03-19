import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from '../../../shared/database/dtos/database.response.dto';

export class ResponseProductFamilyDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
