import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Public } from '@/common/decorators/auth.decorator';
import { ROLE } from '@/common/enum';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.loginService(loginDto);
  }
  @Roles([ROLE.ADMIN])
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return await this.authService.registerService(registerDto);
  }

  @Post('forget-password')
  async forgetPassword(@Body('email') email: string): Promise<any> {
    return await this.authService.forgetPasswordService(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    return await this.authService.resetPasswordService(token, newPassword);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<any> {
    return await this.authService.refreshTokenService(refreshToken);
  }
}
