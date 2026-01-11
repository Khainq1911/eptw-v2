import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Template } from "./Template";

@Entity("template_type", { schema: "public" })
export class TemplateType {
  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp without time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column("timestamp without time zone", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Template, (template) => template.templateType)
  templates: Template[];
}
