import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DEVICE_NOTIFICATION_TYPE } from "../../common/enum";
import { DeviceEntity } from "./device.entity";

@Entity('device_notification')
export class DeviceNotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index('idx_device_notification_timestamp')
    @PrimaryColumn({name: 'timestamp',type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @Column({ name: 'device_id', nullable: false })
    deviceId: number;

    @Column({ type: 'enum', enum: DEVICE_NOTIFICATION_TYPE })
    type: string;

    @Column({ nullable: true })
    message: string;

    @Column({ type: 'jsonb', nullable: true })
    detail: object;

    @ManyToOne(() => DeviceEntity, (device) => device.notifications)
    device: DeviceEntity;
}