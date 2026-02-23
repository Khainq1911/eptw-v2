import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DEVICE_NOTIFICATION_TYPE } from '../../common/enum';

export class DeviceNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    deviceId: number;

    @IsEnum(DEVICE_NOTIFICATION_TYPE)
    @IsNotEmpty()
    type: DEVICE_NOTIFICATION_TYPE;

    @IsString()
    @IsOptional()
    message?: string;

    @IsOptional()
    detail?: object;
}
