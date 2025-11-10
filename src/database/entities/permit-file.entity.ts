import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { PermitEntity } from './permit.entity';

@Entity()
export class PermitFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PermitEntity, (permit) => permit.files, {
    onDelete: 'CASCADE',
  })
  permit: PermitEntity;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_type', length: 100, nullable: true })
  fileType: string;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ name: 'minio_bucket', length: 255 })
  minioBucket: string;

  @Column({ name: 'minio_object_key', length: 512 })
  minioObjectKey: string;

  @Column({ name: 'file_url', type: 'text', nullable: true })
  fileUrl: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
