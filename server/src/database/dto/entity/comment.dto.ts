import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({
    description: 'Comment id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Comment author id',
    example: 9,
  })
  author_id: number;

  @ApiProperty({
    description: 'Card id',
  })
  card_id: number;

  @ApiProperty({
    description: 'Content of message',
    example: 'Try this https://docs.nestjs.com/',
  })
  content: string;

  @ApiProperty({
    description: 'Datetime of create',
    example: '2024-08-16T14:53:56.836Z',
  })
  datetime: Date;

  @ApiProperty({
    description: 'Datetime of last edit',
    example: '2024-08-16T14:53:56.836Z',
  })
  edited?: Date;
}
