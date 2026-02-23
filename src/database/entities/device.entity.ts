import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PermitEntity } from './permit.entity';
import { DeviceNotificationEntity } from './device-notification.entity';

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

  @Column({ name: 'status', nullable: false, default: 'active' })
  status: string;

  @ManyToMany(() => PermitEntity, (permit) => permit.devices)
  permits: PermitEntity[];

  @OneToMany(() => DeviceNotificationEntity, (deviceNotification) => deviceNotification.device)
  notifications: DeviceNotificationEntity[];
}
