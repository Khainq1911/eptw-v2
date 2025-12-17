import { DeviceEntity } from '@/database/entities/device.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateDeviceDto, DeviceDto, FilterDto } from './device.dto';
import AppDataSource from '@/database/data-source';
import { DEVICE_STATUS, DEVICE_STATUS_ALIAS } from '@/common/enum';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async create(device: CreateDeviceDto): Promise<{ message: string }> {
    const existingDevice = await this.deviceRepository.findOne({
      where: { code: device.code },
    });

    if (existingDevice) {
      throw new HttpException('Device with this code already exists', 400);
    }

    await this.deviceRepository.save({ ...device, isUsed: false });

    return { message: 'Device created successfully' };
  }

  async list(filter: FilterDto) {
    const countActiveDevice = await this.deviceRepository.count({
      where: { status: DEVICE_STATUS.ACTIVE },
    });

    const countInactiveDevice = await this.deviceRepository.count({
      where: { status: DEVICE_STATUS.MAINTAIN },
    });

    const countIsUsedDevice = await this.deviceRepository.count({
      where: { isUsed: true },
    });

    const qb = AppDataSource.getRepository(DeviceEntity)
      .createQueryBuilder('device')
      .orderBy('device.updatedAt', 'DESC')
      .limit(filter.limit)
      .offset((filter.page - 1) * filter.limit);

    if (filter.query) {
      qb.andWhere('(device.name = :query OR device.code = :query)', {
        query: filter.query,
      });
    }

    if (filter.status) {
      qb.andWhere('device.status = :status', { status: filter.status });
    }

    if (filter.isUsed !== undefined) {
      qb.andWhere('device.isUsed = :isUsed', { isUsed: filter.isUsed });
    }

    const [devices, number] = await qb.getManyAndCount();

    return {
      devices,
      countAll: number,
      countActiveDevice,
      countInactiveDevice,
      countIsUsedDevice,
    };
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

    await this.deviceRepository.update(id, { status: DEVICE_STATUS.DELETED });

    return { message: 'Device deleted successfully' };
  }

  async getFreeAndActiveDevices() {
    return await this.deviceRepository.find({
      where: { status: 'active', isUsed: false },
    });
  }

  async listDevices() {
    return await this.deviceRepository.find();
  }

  public async deviceStatusStats(): Promise<any> {
    const qb = this.deviceRepository
      .createQueryBuilder('d')
      .select('d.status', 'status')
      .addSelect('COUNT(d.id)', 'count')
      .groupBy('d.status');

    const result = await qb.getRawMany();

    const res = result.map((item) => ({
      name: DEVICE_STATUS_ALIAS[item.status.toUpperCase()],
      count: item.count,
    }));
    return res;
  }

  public async getUsedStats(): Promise<{ name: string; count: number }[]> {
    const data = await this.deviceRepository
      .createQueryBuilder('d')
      .select('d.isUsed', 'name')
      .addSelect('COUNT(d.id)', 'count')
      .groupBy('d.isUsed')
      .getRawMany();

    return data.map((item) => ({
      name:
        item.name === true || item.name === 'true'
          ? 'Đang sử dụng'
          : 'Chưa sử dụng',
      count: +item.count,
    }));
  }
}
