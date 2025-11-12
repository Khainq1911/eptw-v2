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
import { TemplateTypeEntity } from './template-type.entity';

@Entity({ name: 'template' })
export class TemplateEntity extends BaseEntity {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'sections', type: 'jsonb', nullable: true })
  sections: any;

  @Column({ name: 'approval_type_id' })
  approvalTypeId: number;

  @Column({ name: 'template_type_id' })
  templateTypeId: number;

  @ManyToOne(() => ApprovalTypeEntity)
  @JoinColumn({ name: 'approval_type_id' })
  approvalType: ApprovalTypeEntity;

  @ManyToOne(() => TemplateTypeEntity)
  @JoinColumn({ name: 'template_type_id' })
  templateType: TemplateTypeEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_id' })
  updatedBy: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'deleted_id' })
  deletedBy: UserEntity;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Timestamp;
}
