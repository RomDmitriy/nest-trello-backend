import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CardDto } from 'src/database/dto/entity/card.dto';
import { CardsCreateBodyDto } from './dto/create.dto';
import { CardsUpdateBodyDto } from './dto/update.dto';
import { ConflictError, NotFoundError } from 'src/ts/errors';

@Injectable()
export class CardsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Получение всех карточек из колонки пользователя
   * @param column_id - id колонки
   * @returns массив {@link CardDto}
   */
  async getAll(column_id: number): Promise<CardDto[]> {
    return this.databaseService.cards.findMany({
      where: {
        column_id,
      },
      orderBy: [
        {
          index: 'asc',
        },
      ],
    });
  }

  /**
   * Получение определённой карточки
   * @param card_id - id карточки
   * @returns {@link CardDto}
   */
  async get(card_id: number): Promise<CardDto | null> {
    try {
      return await this.databaseService.cards.findUnique({
        where: {
          id: card_id,
        },
      });
    } catch (_) {
      return null;
    }
  }

  /**
   * Создание карточки
   * @param column_id - id колонки, в которой надо создать карточку
   * @param data - информация о карточке (название, описание)
   * @returns информацию о созданной колонке
   */
  async create(column_id: number, data: CardsCreateBodyDto): Promise<CardDto> {
    const lastCard = await this.databaseService.cards.findFirst({
      where: {
        column_id,
      },
      orderBy: [{ index: 'desc' }],
      select: {
        index: true,
      },
    });

    const index: number = lastCard ? lastCard.index + 1 : 0;

    return await this.databaseService.cards.create({
      data: {
        column_id,
        title: data.title,
        description: data.description,
        index,
      },
    });
  }

  /**
   * Обновление карточки
   * @param card_id - id обновляемой карточки
   * @param data - информация о карточке (колонка, название, описание, индекс)
   */
  async update(card_id: number, data: CardsUpdateBodyDto): Promise<void> {
    try {
      await this.databaseService.cards.update({
        where: {
          id: card_id,
        },
        data,
      });
    } catch (err) {
      // Если ошибка уникальности индекса у одной и той же колонки
      if (err.code === 'P2002') {
        throw new ConflictError('That index already exists to current column');
      }
      // Если попытка переноса в несуществующую колонку
      else if (err.code === 'P2003') {
        throw new NotFoundError("That column doesn't exists");
      }

      throw new Error('Unknown error');
    }
  }

  /**
   * Удаление карточки
   * @param card_id - id карточки
   */
  async remove(card_id: number) {
    try {
      await this.databaseService.cards.delete({
        where: {
          id: card_id,
        },
      });
    } catch (err) {
      // Если карточка с таким id не найдена
      if (err.code === 'P2025') throw new Error('Card not found');

      throw new Error('Unknown error');
    }
  }
}
