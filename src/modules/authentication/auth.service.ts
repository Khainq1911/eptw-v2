import { UserEntity } from '@/database/entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto, UserDto, UserJwtPayloadDto } from './auth.dto';

import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { MailService } from '../mailer/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtservice: JwtService,
    private readonly mailService: MailService,
  ) {}

  async loginService(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: [{ email: loginDto.username }, { phone: loginDto.username }],
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 401);
    }

    const payload: UserDto = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    return await this.GenerateTokenService(payload);
  }

  async registerService(
    registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: registerDto.email }, { phone: registerDto.phone }],
    });

    if (existingUser) {
      throw new HttpException('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    await this.userRepository.save({
      ...registerDto,
      password: hashedPassword,
      roleId: 2,
    });

    throw new HttpException('User registered successfully', HttpStatus.CREATED);
  }

  async refreshTokenService(refreshToken: string): Promise<any> {
    try {
      const verifiedToken: UserJwtPayloadDto =
        await this.jwtservice.verifyAsync(refreshToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });

      const user = await this.userRepository.findOne({
        where: { email: verifiedToken.email, refreshToken },
      });

      if (user) {
        const payload: UserDto = {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
        };

        return await this.GenerateTokenService(payload);
      } else {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }

  async forgetPasswordService(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const payload: UserDto = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    const resetToken = await this.jwtservice.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_RESET_PASSWORD_SECRET,
    });

    return await this.mailService.sendMail({
      email: user.email,
      subject: 'Reset Password',
      template: 'reset-password',
      context: {
        name: user.name,
        resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        appName: 'EPTW Service',
      },
    });
  }

  async resetPasswordService(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload: UserJwtPayloadDto = await this.jwtservice.verifyAsync(
        token,
        {
          secret: process.env.JWT_RESET_PASSWORD_SECRET,
        },
      );

      const user = await this.userRepository.findOne({
        where: { id: payload.id, email: payload.email },
      });

      if (!user) {
        throw new HttpException(
          'User not found for this token',
          HttpStatus.NOT_FOUND,
        );
      }

      if (payload.iat * 1000 < new Date(user.updated_at).getTime()) {
        throw new HttpException(
          'Token has already been used',
          HttpStatus.FORBIDDEN,
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userRepository.update(user.id, {
        password: hashedPassword,
        updated_at: new Date(),
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async GenerateTokenService(
    payload: UserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtservice.signAsync(payload);
    const refreshToken = await this.jwtservice.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    if (!accessToken || !refreshToken) {
      throw new HttpException('Failed to generate tokens', 500);
    }

    await this.userRepository.update(payload.id, {
      refreshToken: refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
