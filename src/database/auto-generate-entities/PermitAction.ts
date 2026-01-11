import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Permit } from "./Permit";

@Index("permit_approval_pkey", ["id"], { unique: true })
@Entity("permit_action", { schema: "public" })
export class PermitAction {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "section" })
  section: string;

  @Column("character varying", { name: "status" })
  status: string;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.permitActions)
  @JoinColumn([{ name: "created_id", referencedColumnName: "id" }])
  created: User;

  @ManyToOne(() => Permit, (permit) => permit.permitActions)
  @JoinColumn([{ name: "permit_id", referencedColumnName: "id" }])
  permit: Permit;
}
