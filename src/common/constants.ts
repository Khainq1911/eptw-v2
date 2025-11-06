import { FindOptionsOrderValue } from 'typeorm';

export class QueryDto {
  templateTypeId?: number;
  status?: string;
  page: number = 1;
  limit: number = 10;
  search: string = '';
  sort: FindOptionsOrderValue = 'ASC';
}
