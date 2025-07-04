import { IsString } from 'class-validator';

export class DeviceDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsString()
  status: string;
}
