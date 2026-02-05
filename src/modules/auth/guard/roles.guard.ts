import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { ROLE } from '@/common/enum';
import { UserDto } from '../auth.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const { user }: { user: UserDto } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => (role as number) === user.roleId);
  }
}
