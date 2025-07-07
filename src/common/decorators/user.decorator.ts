import { UserJwtPayloadDto } from '@/modules/auth/auth.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // eslint-disable-line
    const user: UserJwtPayloadDto = request.user; // eslint-disable-line

    return data ? user?.[data] : user; // eslint-disable-line
  },
);
