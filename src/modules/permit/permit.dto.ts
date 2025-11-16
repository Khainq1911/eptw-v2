export class permitDto {
  name: string;
  description?: string;
  peopleNumber: number;
  location?: string;
  companyName: string;
  startTime: Date;
  endTime: Date;
  status: string;
  sections: any;
  templateId: number;
  workActivityIds: number[];
  deviceIds: number[];
  files?: any[];
}

export class permitListForTableDto {
  id: number;
  name: string;
  templateName: string;
  devices: string;
  workActivities: string;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
}

export class filterDto {
  limit: number = 5;
  page: number = 1;
  name?: string;
  templateId?: number;
  devices?: number;
  createdBy?: number;
  workActivities?: number;
  startTime?: Date;
  endTime?: Date;
  status?: string;
}
