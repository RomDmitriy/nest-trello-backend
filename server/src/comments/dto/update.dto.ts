import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CommentsUpdateBodyDto {
  @ApiProperty({
    description: 'Comment text',
    minLength: 1,
    maxLength: 24,
  })
  @MinLength(1)
  @Optional()
  content: string;
}
