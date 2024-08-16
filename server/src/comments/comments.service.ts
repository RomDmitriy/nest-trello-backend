import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CommentsCreateBodyDto } from './dto/create.dto';
import { CommentsUpdateBodyDto } from './dto/update.dto';
import { CommentDto } from 'src/database/dto/entity/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Получение всех комментариев из карточки
   * @param card_id - id карточки
   * @returns массив {@link CommentDto}
   */
  async getAll(card_id: number): Promise<CommentDto[]> {
    return this.databaseService.comments.findMany({
      where: {
        card_id,
      },
      orderBy: [
        {
          datetime: 'asc',
        },
      ],
    });
  }

  /**
   * Получение определённого комментария
   * @param comment_id - id комментария
   * @returns {@link CommentDto}
   */
  async get(comment_id: number): Promise<CommentDto | null> {
    try {
      return await this.databaseService.comments.findUnique({
        where: {
          id: comment_id,
        },
      });
    } catch (_) {
      return null;
    }
  }

  /**
   * Создание комментария
   * @param card_id - id карточки, в которой надо создать комментарий
   * @param data - информация о комментарии (отправитель, содержание)
   * @returns информацию о созданной колонке
   */
  async create(
    card_id: number,
    author_id: number,
    data: CommentsCreateBodyDto,
  ): Promise<CommentDto> {
    console.log(author_id, data);
    return this.databaseService.comments.create({
      data: {
        card_id,
        author_id: author_id,
        content: data.content,
      },
    });
  }

  /**
   * Обновление комментария
   * @param comment_id - id обновляемого комментария
   * @param data - информация о комментарии (содержание)
   */
  async update(comment_id: number, data: CommentsUpdateBodyDto) {
    await this.databaseService.comments.update({
      where: {
        id: comment_id,
      },
      data: {
        edited: new Date(),
        ...data,
      },
    });
  }

  /**
   * Удаление комментария
   * @param comment_id - id комментария
   */
  async remove(comment_id: number) {
    try {
      await this.databaseService.comments.delete({
        where: {
          id: comment_id,
        },
      });
    } catch (err) {
      // Если комментарий с таким id не найден
      if (err.code === 'P2025') throw new Error('Comment not found');

      throw new Error('Unknown error');
    }
  }
}
