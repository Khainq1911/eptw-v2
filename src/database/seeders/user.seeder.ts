import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserEntity } from '../entities';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { ROLE } from '@/common/enum';
export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource.getRepository(UserEntity).save({
      name: 'Admin',
      phone: process.env.ADMIN_PHONE,
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD || '', 10),
      roleId: ROLE.ADMIN,
    });
    console.log('>>> USER SEED');
  }
}
