import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Notification } from "./Notification";
import { User } from "./User";
import { Template } from "./Template";
import { PermitAction } from "./PermitAction";
import { Device } from "./Device";
import { PermitFile } from "./PermitFile";
import { PermitLog } from "./PermitLog";
import { PermitSign } from "./PermitSign";
import { WorkActivity } from "./WorkActivity";

@Index("permit_pkey", ["id"], { unique: true })
@Entity("permit", { schema: "public" })
export class Permit {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("integer", { name: "people_number" })
  peopleNumber: number;

  @Column("text", { name: "location", nullable: true })
  location: string | null;

  @Column("timestamp without time zone", { name: "start_time" })
  startTime: Date;

  @Column("timestamp without time zone", { name: "end_time" })
  endTime: Date;

  @Column("jsonb", { name: "sections" })
  sections: object;

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

  @Column("character varying", { name: "company_name" })
  companyName: string;

  @Column("character varying", { name: "status", default: () => "'Pending'" })
  status: string;

  @OneToMany(() => Notification, (notification) => notification.permit)
  notifications: Notification[];

  @ManyToOne(() => User, (user) => user.permits)
  @JoinColumn([{ name: "created_id", referencedColumnName: "id" }])
  created: User;

  @ManyToOne(() => Template, (template) => template.permits)
  @JoinColumn([{ name: "template_id", referencedColumnName: "id" }])
  template: Template;

  @ManyToOne(() => User, (user) => user.permits2)
  @JoinColumn([{ name: "updated_id", referencedColumnName: "id" }])
  updated: User;

  @OneToMany(() => PermitAction, (permitAction) => permitAction.permit)
  permitActions: PermitAction[];

  @ManyToMany(() => Device, (device) => device.permits)
  devices: Device[];

  @OneToMany(() => PermitFile, (permitFile) => permitFile.permit)
  permitFiles: PermitFile[];

  @OneToMany(() => PermitLog, (permitLog) => permitLog.permit)
  permitLogs: PermitLog[];

  @OneToMany(() => PermitSign, (permitSign) => permitSign.permit)
  permitSigns: PermitSign[];

  @ManyToMany(() => WorkActivity, (workActivity) => workActivity.permits)
  @JoinTable({
    name: "permit_work_activity",
    joinColumns: [{ name: "permit_id", referencedColumnName: "id" }],
    inverseJoinColumns: [
      { name: "work_activity_id", referencedColumnName: "id" },
    ],
    schema: "public",
  })
  workActivities: WorkActivity[];
}
