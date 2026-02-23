export enum ROLE {
  WORKER = 2,
  ADMIN = 1,
}

export enum DEVICE_STATUS {
  ACTIVE = 'active',
  MAINTAIN = 'inactive',
  DELETED = 'deleted',
}

export enum DEVICE_STATUS_ALIAS {
  ACTIVE = 'Active',
  MAINTAIN = 'Inactive',
  DELETED = 'Deleted',
}

export enum APPROVAL_TYPE {
  PARALLEL = 'PA',
  SEQUENCE = 'SA',
}

export enum DEVICE_NOTIFICATION_TYPE {
  LOCATION = 'location',
  NOTIFICATION = 'notification',
  WARNING = 'warning',
}
