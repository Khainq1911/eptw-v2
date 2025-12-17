export enum ROLE {
  WORKER = 1,
  SUPERVISOR = 2,
  PERMIT_ISSUER = 3,
  ADMIN = 4,
}

export enum DEVICE_STATUS {
  ACTIVE = 'active',
  MAINTAIN = 'maintain',
  DELETED = 'deleted',
}

export enum DEVICE_STATUS_ALIAS {
  ACTIVE = 'Active',
  MAINTAIN = 'Under Maintenance',
  DELETED = 'Deleted',
}

export enum APPROVAL_TYPE {
  PARALLEL = 'PA',
  SEQUENCE = 'SA',
}
