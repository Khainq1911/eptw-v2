import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'template_type' })
export class TemplateTypeEntity extends BaseEntity {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
