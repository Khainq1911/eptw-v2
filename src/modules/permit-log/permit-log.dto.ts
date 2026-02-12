import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePermitLogDto {
    @IsNotEmpty()
    @IsString()
    action: string;

    @IsString()
    comment?: string;

    @IsNotEmpty()
    @IsNumber()
    permitId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}