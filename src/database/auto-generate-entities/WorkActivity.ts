import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permit } from "./Permit";

@Index("work_activity_pkey", ["id"], { unique: true })
@Entity("work_activity", { schema: "public" })
export class WorkActivity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "category", nullable: true })
  category: string | null;

  @Column("character varying", { name: "risk_level", nullable: true })
  riskLevel: string | null;

  @ManyToMany(() => Permit, (permit) => permit.workActivities)
  permits: Permit[];
}
