import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(content: MailDto) {
    await this.mailerService.sendMail({
      to: content.email,
      subject: content.subject,
      template: content.template, // eslint-disable-next-line
      context: content.context,
    });
  }
}
