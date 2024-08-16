import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

/**
 * Guard проверки доступа к пользователю из Params.
 * На данный момент доступ имеет только сам пользователь,
 * однако при дальнейшей доработке сюда можно добавить и другие условия
 */

@Injectable()
export class UserAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: number = request.user.userId;
    const entityId: number = parseInt(request.params.user_id);

    if (entityId !== userId) {
      throw new HttpException('You do not own this user', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
