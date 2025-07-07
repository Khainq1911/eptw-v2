import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ExcelService {
  constructor() {}

  async exportExcel<T extends Partial<ExcelJS.Column>[], V extends object[]>(
    res: Response,
    columns: T,
    data: V,
    name: string = 'users.xlsx',
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = columns;

    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();
    res.header('Content-Disposition', `attachment; filename=${name}`);
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }

  async importExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    const result: object[] = [];

    let keys: string[] = [];

    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);

    worksheet?.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (rowNumber === 1) {
        keys = (row.values as string[]).slice(1);
        return;
      }

      const obj: object = {};

      // eslint-disable-next-line
      ((row.values as any).slice(1).map((item: any, index: number) => {
        // eslint-disable-next-line
        obj[keys[index]] = item;
      }),
        result.push(obj));
    });

    return result;
  }
}
