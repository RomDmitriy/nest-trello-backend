import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

/**
 * Не используем проверку длины, т.к. нет необходимости
 */

export class UsersSignInBodyDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    minLength: 3,
    maxLength: 320,
    example: 'test@yandex.ru',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'User password',
    minLength: 6,
    maxLength: 32,
    example: 'qwerty123',
  })
  password: string;
}
