import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class UsersCreateBodyDto {
  @ApiProperty({
    description: 'User name',
    minLength: 4,
    maxLength: 24,
    example: 'Alexey',
  })
  @Length(4, 24)
  name: string;

  @ApiProperty({
    description: 'User email',
    minLength: 3,
    maxLength: 320,
    example: 'test@yandex.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
    maxLength: 32,
    example: 'qwerty123',
  })
  @Length(6, 32)
  password: string;
}
