import { RoleEntity } from '@/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}
  async getRoles() {
    return await this.roleRepository.find();
  }

  public async getAdminRoleId() {
    return await this.roleRepository.findOne({
      where: {
        alias: 'admin',
      },
    });
  }
}
