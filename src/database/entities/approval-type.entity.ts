import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'approval_type' })
export class ApprovalTypeEntity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({ name: 'code', type: 'varchar', length: 10, nullable: false })
  code: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
}
