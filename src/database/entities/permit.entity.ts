import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkActivityEntity } from './work-activity.entity';
import { DeviceEntity } from './device.entity';
import { UserEntity } from './user.entities';
import { PermitFileEntity } from './permit-file.entity';
import { PermitApprovalEntity } from './permit-approval.entity';
import { TemplateEntity } from './template.entity';

@Entity({ name: 'permit' })
export class PermitEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'people_number', type: 'int' })
  peopleNumber: number;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({ default: 'Pending' })
  status: string;

  @Column({ type: 'jsonb' })
  sections: any;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_id' })
  updatedBy: UserEntity;

  @ManyToOne(() => TemplateEntity)
  @JoinColumn({ name: 'template_id' })
  template: TemplateEntity;

  @OneToMany(() => PermitFileEntity, (file) => file.permit)
  files: PermitFileEntity[];

  @OneToMany(() => PermitApprovalEntity, (approval) => approval.permit)
  approvals: PermitApprovalEntity[];

  @ManyToMany(() => WorkActivityEntity)
  @JoinTable({
    name: 'permit_work_activity',
    joinColumn: { name: 'permit_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'work_activity_id', referencedColumnName: 'id' },
  })
  workActivities: WorkActivityEntity[];

  @ManyToMany(() => DeviceEntity)
  @JoinTable({
    name: 'permit_device',
    joinColumn: { name: 'permit_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'device_id', referencedColumnName: 'id' },
  })
  devices: DeviceEntity[];
}
