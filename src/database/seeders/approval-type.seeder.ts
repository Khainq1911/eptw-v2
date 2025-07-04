import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ApprovalTypeEntity } from '../entities/approval-type.entity';
export default class ApprovalTypeSeeder implements Seeder {
  async run(dataSource: DataSource) {
    await dataSource.getRepository(ApprovalTypeEntity).save([
      {
        id: 1,
        name: 'Sequential Approval',
        description:
          'Tasks involving high-risk activities—such as welding or cutting—requiring step-by-step approval in a defined order.',
      },
      {
        id: 2,
        name: 'Parallel Approval',
        description:
          'Lower-risk tasks—such as maintenance or inspection—that allow multiple approvals to proceed simultaneously.',
      },
    ]);

    console.log('>>> APPROVAL TYPE SEED');
  }
}
