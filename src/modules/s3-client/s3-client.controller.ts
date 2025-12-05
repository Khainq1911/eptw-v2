import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { S3ClientService } from './s3-client.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '@/common/decorators/auth.decorator';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3ClientService: S3ClientService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.s3ClientService.uploadFile(file, 'attachment-file');
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    return this.s3ClientService.uploadFiles(files, 'attachment-file');
  }

  @Post('download-url')
 
  async downloadFile(
    @Body()  file: { bucketName: string; fileKey: string },
  ) {
    console.log(file);
    return this.s3ClientService.downloadFile(file.bucketName, file.fileKey);
  }
}
