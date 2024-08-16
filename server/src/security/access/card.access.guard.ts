import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

/**
 * Guard, проверяющий доступ к карточке.
 * На данный момент это проверка, что карточка находится в колонке из Params
 */

@Injectable()
export class CardAccessGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const columnId: number = parseInt(request.params.column_id);
    const entityId: number = parseInt(request.params.card_id);

    const card = await this.databaseService.cards.findUnique({
      where: {
        id: entityId,
      },
      select: {
        column_id: true,
      },
    });

    if (!card) {
      throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
    }

    if (card.column_id !== columnId) {
      throw new HttpException(
        'This column does not include that card',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
