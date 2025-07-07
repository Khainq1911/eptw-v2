import { Public } from './../../common/decorators/auth.decorator';
import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExcelService } from './excel.service';
import { HeaderDto } from './excel.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}
  @Public()
  @Get('download')
  async downloadExcel(@Res() res: Response) {
    const columns: HeaderDto[] = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    const data = [
      { id: 1, name: 'Khai Nguyen', email: 'khai@example.com' },
      { id: 2, name: 'Test User', email: 'test@example.com' },
    ];

    return this.excelService.exportExcel<HeaderDto[], any[]>(
      res,
      columns,
      data,
    );
  }

  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return this.excelService.importExcel(file.buffer);
  }
}
