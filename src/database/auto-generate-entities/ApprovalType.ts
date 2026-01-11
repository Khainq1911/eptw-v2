import { Column, Entity, Index, OneToMany } from "typeorm";
import { Template } from "./Template";

@Index("approval_type_pkey", ["id"], { unique: true })
@Index("UQ_8efc469ea388626db17ffd68e2c", ["name"], { unique: true })
@Entity("approval_type", { schema: "public" })
export class ApprovalType {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("character varying", { name: "name", unique: true, length: 50 })
  name: string;

  @Column("character varying", { name: "code", length: 10 })
  code: string;

  @OneToMany(() => Template, (template) => template.approvalType)
  templates: Template[];
}
