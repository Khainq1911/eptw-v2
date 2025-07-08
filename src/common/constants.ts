import { FindOptionsOrderValue } from 'typeorm';

export class QueryDto {
  page: number = 1;
  limit: number = 10;
  search: string = '';
  sort: FindOptionsOrderValue = 'ASC';
}
