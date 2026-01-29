import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { PermitEntity } from "./permit.entity";
import { UserEntity } from "./user.entity";

@Index("permit_log_pkey", ["id"], { unique: true })
@Entity("permit_log", { schema: "public" })
export class PermitLogEntity {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("character varying", { name: "action", length: 50 })
    action: string;

    @Column("text", { name: "comment", nullable: true })
    comment: string | null;

    @Column("timestamp without time zone", {
        name: "created_at",
        nullable: true,
        default: () => "now()",
    })
    createdAt: Date | null;

    @ManyToOne(() => PermitEntity, (permit) => permit.permitLogs)
    @JoinColumn([{ name: "permit_id", referencedColumnName: "id" }])
    permit: PermitEntity;

    @ManyToOne(() => UserEntity, (user) => user.permitLogs)
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
    user: UserEntity;
}
