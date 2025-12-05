import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PermitValidator implements PipeTransform {
  transform(payload: any, metadata: ArgumentMetadata) {}
}
