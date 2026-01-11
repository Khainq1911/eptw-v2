import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermitEntity } from './permit.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'permit_sign' })
export class PermitSignEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'permit_id' })
  permitId: number;

  @ManyToOne(() => PermitEntity, (permit) => permit.sign)
  @JoinColumn({ name: 'permit_id' })
  permit: PermitEntity;

  @Column({ name: 'section_id' })
  sectionId: number;

  @Column({ name: 'signer_id', unique: false })
  signerId: number;

  @Column({ name: 'sign_url', type: 'text', nullable: true })
  signUrl: string;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'signer_id' })
  signer: UserEntity;

  @Column({ name: 'status', type: 'varchar', length: 50, nullable: true })
  status: string;

  @CreateDateColumn({ name: 'signed_at', type: 'timestamp', nullable: true })
  signedAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  updatedAt: Date;
}
