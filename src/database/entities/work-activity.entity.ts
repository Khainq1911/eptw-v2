import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PermitEntity } from './permit.entity';

@Entity({ name: 'work_activity' })
export class WorkActivityEntity extends BaseEntity {
  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  riskLevel: string;

  @ManyToMany(() => PermitEntity, (permit) => permit.workActivities)
  permits: PermitEntity[];
}
