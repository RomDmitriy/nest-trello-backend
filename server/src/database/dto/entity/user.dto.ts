import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: 9,
  })
  id: number;

  @ApiProperty({
    description: 'User name',
    example: 'Alexey',
  })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'test@yandex.ru',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'qwerty123',
  })
  password: string;
}
