import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'menu' })
export class MenuEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ nullable: false, unique: true })
  url: string;

  @Column({ nullable: false })
  icon: string;

  @Column({ nullable: true })
  parent_id: string;

}