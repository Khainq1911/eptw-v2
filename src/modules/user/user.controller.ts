import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../auth/auth.dto';
import { createUserDto, updateUserDto, userFilterDto } from './user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLE } from '@/common/enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Roles(ROLE.ADMIN)
  @Post('filter')
  async getUserWithFilter(@Body() payload: userFilterDto) {
    return await this.userService.getUserWithFilter(payload);
  }

  @Post()
  async create(@Body() payload: RegisterDto) {
    return await this.userService.create(payload);
  }

  @Roles(ROLE.ADMIN)
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() payload: updateUserDto) {
    return await this.userService.UpdateUser(id, payload);
  }

  @Roles(ROLE.ADMIN)
  @Post('create')
  async createUser(@Body() payload: createUserDto) {
    return await this.userService.createUser(payload);
  }

  @Roles(ROLE.ADMIN)
  @Get('find/:id')
  async findById(@Param('id') id: number) {
    return await this.userService.findById(id);
  }
}
