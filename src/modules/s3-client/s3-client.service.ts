import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3ClientService {
  private readonly s3Client: S3Client;
  private readonly attachmentFileBucketName: string;
  private readonly signBucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.attachmentFileBucketName = this.configService.get<string>(
      'AWS_S3_ATTACHMENT_FILE_BUCKET_NAME',
    )!;
    this.signBucketName = this.configService.get<string>(
      'AWS_S3_SIGN_BUCKET_NAME',
    )!;

    console.log("AWS_S3_REGION",this.configService.get<string>('AWS_S3_REGION'));
    console.log("AWS_S3_ENDPOINT",this.configService.get<string>('AWS_S3_ENDPOINT'));
    console.log("AWS_ACCESS_KEY_ID",this.configService.get<string>('AWS_ACCESS_KEY_ID'));
    console.log("AWS_SECRET_ACCESS_KEY",this.configService.get<string>('AWS_SECRET_ACCESS_KEY'));
    console.log("AWS_S3_ATTACHMENT_FILE_BUCKET_NAME",this.configService.get<string>('AWS_S3_ATTACHMENT_FILE_BUCKET_NAME'));
    console.log("AWS_S3_SIGN_BUCKET_NAME",this.configService.get<string>('AWS_S3_SIGN_BUCKET_NAME'));

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
      forcePathStyle: true,
    });

    this.initBuckets();
  }

  private async initBuckets() {
    try {
      await this.s3Client.send(new ListBucketsCommand({}));
      console.log('✅ S3 client connected successfully');

      await this.ensureBucket(this.attachmentFileBucketName);
      await this.ensureBucket(this.signBucketName);
    } catch (error) {
      console.error('❌ S3 client connection failed:', error);
    }
  }

  private async ensureBucket(bucketName: string) {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`✅ Bucket "${bucketName}" already exists`);
    } catch (err) {
      console.log(`⚠ Bucket "${bucketName}" does not exist. Creating...`);
      await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`✅ Bucket "${bucketName}" created successfully`);
    }
  }

  public async uploadFile(file: Express.Multer.File, bucketName: string) {
    const safeFileName = file.originalname.replace(/\s+/g, '_');
    const key = safeFileName + '-' + uuidv4();
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const baseUrl = this.configService.get<string>('AWS_S3_ENDPOINT');
      const fileUrl = `${baseUrl}/${bucketName}/${key}`;
      return {
        key: key,
        url: fileUrl,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bucket: bucketName,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException('Upload file failed');
    }
  }

  public async uploadFiles(files: Express.Multer.File[], bucketName: string) {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, bucketName)),
    );

    return results;
  }

  public async downloadFile(bucketName: string, fileKey: string) {
    try {
      console.log(fileKey);
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });
      console.log(command);
      const downloadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      console.log(3);
      return { url: downloadUrl };
    } catch (error) {
      console.error('Download failed:', error);
      throw new InternalServerErrorException('Download file failed');
    }
  }
}
