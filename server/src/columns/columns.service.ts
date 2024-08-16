import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ColumnsCreateBodyDto } from './dto/create.dto';
import { ColumnDto } from '../database/dto/entity/column.dto';
import { ColumnsUpdateBodyDto } from './dto/update.dto';

@Injectable()
export class ColumnsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Получение всех колонок пользователя
   * @param user_id - id пользователя
   * @returns массив {@link ColumnDto}
   */
  async getAll(user_id: number): Promise<ColumnDto[]> {
    return this.databaseService.columns.findMany({
      where: {
        owner_id: user_id,
      },
      orderBy: [
        {
          index: 'asc',
        },
      ],
    });
  }

  /**
   * Получение определённой колонки пользователя
   * @param column_id - id колонки
   * @returns {@link ColumnDto}
   */
  async get(column_id: number): Promise<ColumnDto | null> {
    try {
      return await this.databaseService.columns.findUnique({
        where: {
          id: column_id,
        },
      });
    } catch (_) {
      return null;
    }
  }

  /**
   * Создание колонки
   * @param user_id - id пользователя, у которого создать колонку
   * @param data - информация о колонке (название)
   * @returns информацию о созданной колонке
   */
  async create(
    user_id: number,
    data: ColumnsCreateBodyDto,
  ): Promise<ColumnDto> {
    const lastColumn = await this.databaseService.columns.findFirst({
      where: {
        owner_id: user_id,
      },
      orderBy: [{ index: 'desc' }],
      select: {
        index: true,
        id: true,
      },
    });

    const index: number = lastColumn ? lastColumn.index + 1 : 0;

    return await this.databaseService.columns.create({
      data: {
        owner_id: user_id,
        name: data.name,
        index,
      },
    });
  }

  /**
   * Обновление колонки
   * @param column_id - id колонки
   * @param data - информация о колонке (название, индекс)
   */
  async update(column_id: number, data: ColumnsUpdateBodyDto) {
    try {
      await this.databaseService.columns.update({
        where: {
          id: column_id,
        },
        data,
      });
    } catch (err) {
      // Если ошибка уникальности индекса у одного и того же пользователя
      if (err.code === 'P2002') {
        throw new Error('That index already exists to current user');
      }

      throw new Error('Unknown error');
    }
  }

  /**
   * Удаление колонки
   * @param column_id - id колонки
   */
  async remove(column_id: number) {
    try {
      await this.databaseService.columns.delete({
        where: {
          id: column_id,
        },
      });
    } catch (err) {
      // Если колонка с таким id не найдена
      if (err.code === 'P2025') throw new Error('Column not found');

      throw new Error('Unknown error');
    }
  }
}
