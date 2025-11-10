import { IsOptional, IsString } from 'class-validator';

export class createDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  riskLevel: string;
}
