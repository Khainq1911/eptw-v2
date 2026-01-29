import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuEntity } from './menu.entity';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {

  @Column()
  name: string;

  @Column()
  alias: string;

  @ManyToMany(() => MenuEntity, (menu) => menu.roles)
  @JoinTable({
    name: 'role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: MenuEntity[];
}
