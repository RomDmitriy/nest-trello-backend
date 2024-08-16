import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

/**
 * Guard проверки существования такой колонки
 */

@Injectable()
export class ColumnExistsGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: number = parseInt(request.params.user_id);
    const entityId: number = parseInt(request.params.column_id);

    const column = await this.databaseService.columns.findUnique({
      where: { id: entityId },
      select: {
        owner_id: true,
      },
    });

    if (!column || column.owner_id !== userId) {
      throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
