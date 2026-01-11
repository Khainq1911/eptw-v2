import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permit } from "./Permit";

@Index("UQ_f443a15b68542d0a53a2b8c4723", ["code"], { unique: true })
@Index("device_pkey", ["id"], { unique: true })
@Entity("device", { schema: "public" })
export class Device {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "code", unique: true })
  code: string;

  @Column("character varying", { name: "description", nullable: true })
  description: string | null;

  @Column("character varying", { name: "status", default: () => "'active'" })
  status: string;

  @Column("boolean", { name: "is_used" })
  isUsed: boolean;

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

  @Column("jsonb", { name: "location", nullable: true })
  location: object | null;

  @ManyToMany(() => Permit, (permit) => permit.devices)
  @JoinTable({
    name: "permit_device",
    joinColumns: [{ name: "device_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "permit_id", referencedColumnName: "id" }],
    schema: "public",
  })
  permits: Permit[];
}
