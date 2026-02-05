import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../auth/auth.dto';
import { createUserDto, updateUserDto, userFilterDto } from './user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLE } from '@/common/enum';
import { ExcelService } from '../excel/excel.service';
import { Response } from 'express';
import { HeaderDto } from '../excel/excel.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Roles([ROLE.ADMIN])
  @Post('filter')
  async getUserWithFilter(@Body() payload: userFilterDto) {
    return await this.userService.getUserWithFilter(payload);
  }

  @Post()
  async create(@Body() payload: RegisterDto) {
    return await this.userService.create(payload);
  }

  @Roles([ROLE.ADMIN])
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() payload: updateUserDto) {
    return await this.userService.UpdateUser(id, payload);
  }

  @Roles([ROLE.ADMIN])
  @Post('create')
  async createUser(@Body() payload: createUserDto) {
    return await this.userService.createUser(payload);
  }

  @Roles([ROLE.ADMIN])
  @Get('find/:id')
  async findById(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  @Roles([ROLE.ADMIN])
  @Get('export')  
  async exportExcel(@Res() res: Response) {
    const listUser = await this.userService.getAll();

    const headers: HeaderDto[] = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 30 },
      { header: 'Role', key: 'roleName', width: 30 },
    ];

    const data = listUser.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleName: user.roleName,
    }));

    return this.excelService.exportExcel(res, headers, data, 'users.xlsx');
  }
}
