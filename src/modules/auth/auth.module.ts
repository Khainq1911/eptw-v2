import { UserEntity } from '@/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mailer/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: Number(process.env.JWT_EXPIRATION) },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
