import { IsEmail, IsNumber, IsString } from 'class-validator';

export class userDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
}

export class userFilterDto {
  nameFilter?: string;
  roleIdFilter?: number;
  limit: number = 5;
  page: number = 1;
}

export class updateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  roleId?: number;
}

export class createUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsNumber()
  roleId: number;
}
