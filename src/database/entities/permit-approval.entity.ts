import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { PermitEntity } from './permit.entity';
import { UserEntity } from './user.entities';

@Entity({ name: 'permit_approval' })
export class PermitApprovalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  section: string;

  @Column()
  status: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => UserEntity)
  approval: UserEntity;

  @ManyToOne(() => PermitEntity, (permit) => permit.approvals)
  permit: PermitEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
