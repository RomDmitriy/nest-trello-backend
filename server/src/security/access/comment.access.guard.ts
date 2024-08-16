import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

/**
 * Guard, проверяющий доступ к колонке.
 * На данный момент это проверка, что его оставил текущий пользователь
 */

@Injectable()
export class CommentAccessGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user_id: number = parseInt(request.params.user_id);
    const entityId: number = parseInt(request.params.comment_id);

    const comment = await this.databaseService.comments.findUnique({
      where: {
        id: entityId,
      },
      select: {
        author_id: true,
      },
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (comment.author_id !== user_id) {
      throw new HttpException(
        'This card does not include that comment',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
