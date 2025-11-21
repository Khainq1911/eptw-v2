import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PermitEntity } from './permit.entity';

@Entity({name:"permit_file"})
export class PermitFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PermitEntity)
  @JoinColumn({ name: 'permit_id' })
  permit: PermitEntity;

  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'type', length: 100, nullable: true })
  type: string;

  @Column({ name: 'size', type: 'bigint', nullable: true })
  size: number;

  @Column({ name: 'bucket', length: 255 })
  bucket: string;

  @Column({ name: 'object_key', length: 512 })
  objectKey: string;

  @Column({ name: 'url', type: 'text', nullable: true })
  url: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
