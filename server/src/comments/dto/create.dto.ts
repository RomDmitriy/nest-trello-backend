import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CommentsCreateBodyDto {
  @ApiProperty({
    description: 'Comment text',
    minLength: 1,
    maxLength: 24,
  })
  @MinLength(1)
  content: string;
}
