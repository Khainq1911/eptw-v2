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
