import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

/**
 * Guard проверки существования такой карточки
 */

@Injectable()
export class CardExistsGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const columnId: number = parseInt(request.params.column_id);
    const entityId: number = parseInt(request.params.card_id);

    const card = await this.databaseService.cards.findUnique({
      where: { id: entityId },
      select: {
        column_id: true,
      },
    });

    if (!card || card.column_id !== columnId) {
      throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
