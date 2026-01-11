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

@Index("permit_sign_pkey", ["id"], { unique: true })
@Entity("permit_sign", { schema: "public" })
export class PermitSign {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "section_id" })
  sectionId: number;

  @Column("character varying", { name: "status", nullable: true, length: 50 })
  status: string | null;

  @Column("timestamp without time zone", {
    name: "signed_at",
    nullable: true,
    default: () => "now()",
  })
  signedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @Column("text", { name: "sign_url", nullable: true })
  signUrl: string | null;

  @Column("text", { name: "reason", nullable: true })
  reason: string | null;

  @ManyToOne(() => Permit, (permit) => permit.permitSigns)
  @JoinColumn([{ name: "permit_id", referencedColumnName: "id" }])
  permit: Permit;

  @ManyToOne(() => User, (user) => user.permitSigns)
  @JoinColumn([{ name: "signer_id", referencedColumnName: "id" }])
  signer: User;
}
