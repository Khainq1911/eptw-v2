import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permit } from "./Permit";

@Index("permit_file_pkey", ["id"], { unique: true })
@Entity("permit_file", { schema: "public" })
export class PermitFile {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "size", nullable: true })
  size: string | null;

  @Column("character varying", { name: "bucket", length: 255 })
  bucket: string;

  @Column("character varying", { name: "object_key", length: 512 })
  objectKey: string;

  @Column("text", { name: "url", nullable: true })
  url: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "type", nullable: true, length: 100 })
  type: string | null;

  @ManyToOne(() => Permit, (permit) => permit.permitFiles)
  @JoinColumn([{ name: "permit_id", referencedColumnName: "id" }])
  permit: Permit;
}
