import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TemplateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  approvalTypeId: number;

  fields: any;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  approvalTypeId: number;

  fields: any;
}
