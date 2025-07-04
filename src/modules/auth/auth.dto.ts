export class LoginDto {
  username: string;
  password: string;
}

export class RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export class UserDto {
  id: number;
  email: string;
  phone: string;
  name: string;
  roleId: number;
}

export class UserJwtPayloadDto {
  id: number;
  email: string;
  phone: string;
  name: string;
  iat: number;
  exp: number;
}
export class ForgotPasswordDto {
  email: string;
}
