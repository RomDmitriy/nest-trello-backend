import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { UsersCreateBodyDto } from './dto/create.dto';
import { JWT } from './dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersUpdateBodyDto } from './dto/update.dto';
import { UsersSignInBodyDto } from './dto/signIn.dto';
import { UserDto } from 'src/database/dto/entity/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  /**
   * Создание нового пользователя
   * @param data - информация о пользователе
   * @returns JWT-токен
   */
  async signUp(data: UsersCreateBodyDto): Promise<JWT> {
    const passwordSalt = await bcrypt.genSalt(12);

    const result = await this.databaseService.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash(data.password, passwordSalt),
      },
    });

    return {
      access_token: this.jwtService.sign({ id: result.id }),
    } as JWT;
  }

  /**
   * Вход в аккаунт
   * @param data - данные для входа (почта & пароль)
   * @returns JWT-токен
   */
  async signIn(data: UsersSignInBodyDto): Promise<JWT> {
    const user = await this.databaseService.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('User not found');
    }

    return {
      access_token: this.jwtService.sign({ id: user.id }),
    } as JWT;
  }

  /**
   * Поиск пользователя по id
   * @param user_id - id пользователя
   * @returns Dto пользователя, либо ничего, если пользователь не найден
   */
  async findById(user_id: number): Promise<UserDto | null> {
    try {
      return await this.databaseService.users.findUnique({
        where: {
          id: user_id,
        },
      });
    } catch (err) {
      return null;
    }
  }

  /**
   * Обновление данных пользователя
   * @param user_id - id пользователя
   * @param data - данные, которыми надо перезаписать предыдущие
   */
  async update(user_id: number, data: UsersUpdateBodyDto): Promise<void> {
    if (data.password) {
      const salt = await bcrypt.genSalt(12);
      data.password = await bcrypt.hash(data.password, salt);
    }

    await this.databaseService.users.update({
      where: {
        id: user_id,
      },
      data,
    });
  }

  /**
   * Удаление пользователя
   * @param user_id - id пользователя
   */
  async remove(user_id: number): Promise<void> {
    await this.databaseService.users.delete({
      where: {
        id: user_id,
      },
    });
  }
}
