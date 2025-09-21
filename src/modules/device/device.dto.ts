import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class DeviceDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsBoolean()
  isUsed: boolean;

  @IsString()
  description: string;

  @IsString()
  status: string;
}

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  description?: string;
}

export class FilterDto {
  page: number;
  limit: number;
  query?: string;
  status?: string;
  isUsed?: boolean;
}
