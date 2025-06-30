import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  alias: string;
}
