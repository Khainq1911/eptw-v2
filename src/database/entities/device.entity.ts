import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PermitEntity } from './permit.entity';

@Entity({ name: 'device' })
export class DeviceEntity extends BaseEntity {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'code', unique: true, nullable: false })
  code: string;

  @Column({ name: 'is_used', nullable: false, type: 'boolean' })
  isUsed: boolean;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'location', nullable: true, type: 'jsonb' })
  location: object;

  @Column({ name: 'status', nullable: false, default: 'Available' })
  status: string;

  @ManyToMany(() => PermitEntity, (permit) => permit.devices)
  permits: PermitEntity[];
}
