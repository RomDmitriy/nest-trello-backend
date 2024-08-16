import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsOptional, Length } from 'class-validator';

export class UsersUpdateParamsDto {
  @ApiProperty({
    description: 'User id to update',
  })
  @IsNumberString()
  id: string;
}

export class UsersUpdateBodyDto {
  @ApiProperty({
    description: 'User name',
    minLength: 4,
    maxLength: 24,
    example: 'Alexey',
  })
  @Length(4, 24)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User email',
    minLength: 3,
    maxLength: 320,
    example: 'test@yandex.ru',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
    maxLength: 32,
    example: 'qwerty123',
  })
  @Length(6, 32)
  @IsOptional()
  password?: string;
}
