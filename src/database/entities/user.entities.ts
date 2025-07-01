import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'name', nullable: false, type: 'varchar' })
  name: string;

  @Column({ name: 'email', unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Column({ name: 'password', nullable: false, type: 'text' })
  password: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'refresh_token', nullable: true, type: 'text' })
  refreshToken: string;

  @Column({ name: 'role_id', nullable: false, type: 'int' })
  roleId: number;
}
