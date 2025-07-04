import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'device' })
export class DeviceEntity extends BaseEntity {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'code', unique: true, nullable: false })
  code: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'status', nullable: false, default: 'Available' })
  status: string;
}
