import { DeviceEntity } from '@/database/entities/device.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DeviceDto } from './device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async create(device: DeviceDto): Promise<{ message: string }> {
    const existingDevice = await this.deviceRepository.findOne({
      where: { code: device.code },
    });

    if (existingDevice) {
      throw new HttpException('Device with this code already exists', 400);
    }

    await this.deviceRepository.save(device);

    return { message: 'Device created successfully' };
  }

  async list() {
    const [devices, number] = await this.deviceRepository.findAndCount({
      order: { updated_at: 'DESC' },
    });

    return { devices, count: number };
  }

  public async getDeviceById(id: number) {
    return await this.deviceRepository.findOne({ where: { id: id } });
  }

  async update(device: DeviceDto, id: number): Promise<{ message: string }> {
    const existingDevice = await this.deviceRepository.findOne({
      where: { id: id },
    });
    if (!existingDevice) {
      throw new HttpException('Device not found', 404);
    }

    const deviceWithSameCode = await this.deviceRepository.findOne({
      where: { code: device.code, id: Not(id) },
    });
    if (deviceWithSameCode) {
      throw new HttpException('Device with this code already exists', 400);
    }

    await this.deviceRepository.update(id, device);

    return { message: 'Device updated successfully' };
  }

  async delete(id: number): Promise<{ message: string }> {
    const existingDevice = await this.deviceRepository.findOne({
      where: { id: id },
    });
    if (!existingDevice) {
      throw new HttpException('Device not found', 404);
    }

    await this.deviceRepository.update(id, { status: 'delete' });

    return { message: 'Device deleted successfully' };
  }
}
