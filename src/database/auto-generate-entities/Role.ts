import { Column, Entity, Index, OneToMany } from "typeorm";
import { User } from "./User";

@Index("role_pkey", ["id"], { unique: true })
@Entity("role", { schema: "public" })
export class Role {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "alias" })
  alias: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
