import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import 'dotenv/config';
import {
  ApprovalTypeEntity,
  DeviceEntity,
  RoleEntity,
  TemplateEntity,
  TemplateTypeEntity,
  UserEntity,
} from './entities';
import { PermitEntity } from './entities/permit.entity';
import { PermitFileEntity } from './entities/permit-file.entity';
import { PermitApprovalEntity } from './entities/permit-approval.entity';
import { WorkActivityEntity } from './entities/work-activity.entity';
import { PermitSignEntity } from './entities/permit-sign.entity';
const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    UserEntity,
    RoleEntity,
    DeviceEntity,
    TemplateEntity,
    ApprovalTypeEntity,
    TemplateTypeEntity,
    PermitEntity,
    PermitFileEntity,
    PermitApprovalEntity,
    WorkActivityEntity,
    PermitSignEntity,
  ],
  migrations: ['src/database/migrations/*.{ts,js}'],
  seeds: ['src/database/seeders/*.{ts,js}'],
};

const AppDataSource = new DataSource(options);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
