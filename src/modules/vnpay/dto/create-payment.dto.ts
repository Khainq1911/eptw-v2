import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000, { message: 'Số tiền tối thiểu là 1,000 VND' })
  amount: number;

  @IsNotEmpty()
  @IsString()
  orderInfo: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  locale?: string;
}
