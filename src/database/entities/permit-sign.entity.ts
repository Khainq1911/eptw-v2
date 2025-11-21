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
import { UserEntity } from './user.entities';

@Entity({ name: 'permit_sign' })
export class PermitSignEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permit_id: number;

  @ManyToOne(() => PermitEntity, (permit) => permit.sign)
  @JoinColumn({ name: 'permit_id' })
  permit: PermitEntity;

  @Column()
  section_id: number;

  @Column()
  signer_id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'signer_id' })
  signer: UserEntity;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  signed_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
