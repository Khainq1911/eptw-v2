import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './common/decorators/roles.decorator';
import { ROLE } from './common/enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles([ROLE.ADMIN])
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
