import { UserEntity } from '@/database/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createUserDto,
  updateUserDto,
  userDto,
  userFilterDto,
} from './user.dto';
import { RegisterDto } from '../auth/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: RegisterDto): Promise<any> {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    return {
      name: savedUser.name,
    };
  }

  public async getUserWithFilter(filter: userFilterDto) {
    let qb = this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role');

    if (filter.nameFilter) {
      qb = qb.andWhere('user.name ILIKE :name', {
        name: `%${filter.nameFilter}%`,
      });
    }
    if (filter.roleIdFilter) {
      qb = qb.andWhere('user.role.id = :roleId', {
        roleId: filter.roleIdFilter,
      });
    }

    const count = await qb.getCount();
    qb = qb
      .orderBy('user.createdAt', 'DESC')
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit);

    return { data: await qb.getMany(), count };
  }

  async getAll(): Promise<userDto[]> {
    const users = await this.userRepository.find({ relations: ['role'] });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.role.id,
      roleName: user.role.name,
    }));
  }

  public async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  public async UpdateUser(id: number, data: updateUserDto) {
    const { roleId, ...rest } = data;

    const oldUser = await this.userRepository.findOne({ where: { id } });

    if (!oldUser) {
      throw new BadRequestException('User not found');
    }

    const payload = { ...rest, role: { id: roleId } };

    await this.userRepository.update(id, payload);
    
    return this.findById(id);
  }

  public async createUser(data: createUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or phone already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: { id: data.roleId },
    });

    await this.userRepository.save(newUser);

    return newUser;
  }
}
