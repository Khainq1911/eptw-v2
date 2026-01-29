import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RoleEntity } from '../entities/role.entity';

export default class RoleSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource.getRepository(RoleEntity).save([
      { id: 2, name: 'Worker', alias: 'worker' },
      { id: 1, name: 'Admin', alias: 'admin' },
    ]);
    console.log('>>> ROLE SEED');
  }
}
