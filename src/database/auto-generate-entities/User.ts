import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Notification } from "./Notification";
import { Permit } from "./Permit";
import { PermitAction } from "./PermitAction";
import { PermitLog } from "./PermitLog";
import { PermitSign } from "./PermitSign";
import { Template } from "./Template";
import { Role } from "./Role";

@Index("user_email_key", ["email"], { unique: true })
@Index("user_pkey", ["id"], { unique: true })
@Index("user_phone", ["phone"], { unique: true })
@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "phone", unique: true })
  phone: string;

  @Column("character varying", { name: "email", unique: true })
  email: string;

  @Column("text", { name: "password" })
  password: string;

  @Column("text", { name: "refresh_token", nullable: true })
  refreshToken: string | null;

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

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Permit, (permit) => permit.created)
  permits: Permit[];

  @OneToMany(() => Permit, (permit) => permit.updated)
  permits2: Permit[];

  @OneToMany(() => PermitAction, (permitAction) => permitAction.created)
  permitActions: PermitAction[];

  @OneToMany(() => PermitLog, (permitLog) => permitLog.user)
  permitLogs: PermitLog[];

  @OneToMany(() => PermitSign, (permitSign) => permitSign.signer)
  permitSigns: PermitSign[];

  @OneToMany(() => Template, (template) => template.created)
  templates: Template[];

  @OneToMany(() => Template, (template) => template.deleted)
  templates2: Template[];

  @OneToMany(() => Template, (template) => template.updated)
  templates3: Template[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;
}
