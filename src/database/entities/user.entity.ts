import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';
import { Exclude } from 'class-transformer';
import { PermitLogEntity } from './permit-log.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'name', nullable: false, type: 'varchar' })
  name: string;

  @Column({ name: 'email', unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ name: 'password', nullable: false, type: 'text' })
  password: string;

  @Column({ name: 'phone' })
  phone: string;

  @Exclude()
  @Column({
    name: 'refresh_token',
    nullable: true,
    type: 'text',
  })
  refreshToken: string;

  @OneToMany(() => PermitLogEntity, (permitLog) => permitLog.user)
  permitLogs: PermitLogEntity[];

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
