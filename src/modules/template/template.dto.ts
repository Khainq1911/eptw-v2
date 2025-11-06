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
