import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Timestamp,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApprovalTypeEntity } from './approval-type.entity';
import { UserEntity } from './user.entities';

@Entity({ name: 'template' })
export class TemplateEntity extends BaseEntity {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'fields', type: 'jsonb', nullable: true })
  fields: any;

  @ManyToOne(() => ApprovalTypeEntity)
  @JoinColumn({ name: 'approval_type_id' })
  approvalType: ApprovalTypeEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_id' })
  updatedBy: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'deleted_id' })
  deletedBy: UserEntity;

  @DeleteDateColumn()
  deletedAt: Timestamp;
}
