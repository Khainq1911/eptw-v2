export enum ROLE {
  WORKER = 2,
  ADMIN = 1,
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
