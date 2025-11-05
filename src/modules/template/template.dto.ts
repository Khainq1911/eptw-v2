import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  approvalTypeId: number;

  @IsNumber()
  templateTypeId: number;

  sections: any;
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

  sections: any;
}
