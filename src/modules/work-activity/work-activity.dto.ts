import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkActivityDto {
  @IsNotEmpty({ message: 'Tên hoạt động không được để trống' })
  @IsString({ message: 'Tên hoạt động phải là chuỗi ký tự' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Danh mục phải là chuỗi ký tự' })
  category: string;

  @IsNotEmpty({ message: 'Mức độ rủi ro không được để trống' })
  @IsString({ message: 'Mức độ rủi ro phải là chuỗi ký tự' })
  riskLevel: string;
}

export class UpdateWorkActivityDto {
  @IsOptional()
  @IsString({ message: 'Tên hoạt động phải là chuỗi ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Danh mục phải là chuỗi ký tự' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'Mức độ rủi ro phải là chuỗi ký tự' })
  riskLevel?: string;
}

export class FilterWorkActivityDto {
  page: number;
  limit: number;
  name?: string;
  category?: string;
  riskLevel?: string;
}
