import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permit } from "./Permit";
import { User } from "./User";

@Index("notification_pkey", ["id"], { unique: true })
@Entity("notification", { schema: "public" })
export class Notification {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "type", length: 50 })
  type: string;

  @Column("character varying", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "message" })
  message: string;

  @Column("boolean", {
    name: "is_read",
    nullable: true,
    default: () => "false",
  })
  isRead: boolean | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @ManyToOne(() => Permit, (permit) => permit.notifications)
  @JoinColumn([{ name: "permit_id", referencedColumnName: "id" }])
  permit: Permit;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
