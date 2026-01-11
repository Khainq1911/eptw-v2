import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permit } from "./Permit";
import { ApprovalType } from "./ApprovalType";
import { User } from "./User";
import { TemplateType } from "./TemplateType";

@Index("template_pkey", ["id"], { unique: true })
@Entity("template", { schema: "public" })
export class Template {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "description", nullable: true })
  description: string | null;

  @Column("jsonb", { name: "sections", nullable: true })
  sections: object | null;

  @Column("timestamp without time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

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

  @OneToMany(() => Permit, (permit) => permit.template)
  permits: Permit[];

  @ManyToOne(() => ApprovalType, (approvalType) => approvalType.templates)
  @JoinColumn([{ name: "approval_type_id", referencedColumnName: "id" }])
  approvalType: ApprovalType;

  @ManyToOne(() => User, (user) => user.templates)
  @JoinColumn([{ name: "created_id", referencedColumnName: "id" }])
  created: User;

  @ManyToOne(() => User, (user) => user.templates2)
  @JoinColumn([{ name: "deleted_id", referencedColumnName: "id" }])
  deleted: User;

  @ManyToOne(() => User, (user) => user.templates3)
  @JoinColumn([{ name: "updated_id", referencedColumnName: "id" }])
  updated: User;

  @ManyToOne(() => TemplateType, (templateType) => templateType.templates)
  @JoinColumn([{ name: "template_type_id", referencedColumnName: "id" }])
  templateType: TemplateType;
}
