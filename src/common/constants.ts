import { FindOptionsOrderValue } from 'typeorm';

export class QueryDto {
  templateTypeId?: number;
  status?: string;
  page: number = 1;
  limit: number = 10;
  search: string = '';
  sort: FindOptionsOrderValue = 'ASC';
}

export class PERMIT_STATUS {
  static readonly PENDING = 'Pending';
  static readonly APPROVED = 'Approved';
  static readonly REJECTED = 'Rejected';
  static readonly EXPIRED = 'Expired';
  static readonly CANCELLED = 'Cancelled';
  static readonly CLOSED = 'Closed';
}

export class ROLE_TYPE {
  static readonly ADMIN = 'Admin';
  static readonly WORKER = 'Worker';
}


export class APPROVAL_TYPE {
  static readonly PARALLEL = 'PA';
  static readonly SEQUENCE = 'SA';
}
