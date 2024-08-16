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
 * На данный момент это проверка, что колонкой владеет пользователь из Params
 */

@Injectable()
export class ColumnAccessGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId: number = request.user.userId;
    const entityId: number = parseInt(request.params.column_id);

    const column = await this.databaseService.columns.findUnique({
      where: {
        id: entityId,
      },
      select: {
        owner_id: true,
      },
    });

    if (!column) {
      throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
    }

    if (column.owner_id !== userId) {
      throw new HttpException(
        'You do not own this column',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
