import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
  @ApiProperty({
    description: 'Card id',
    example: 0,
  })
  id: number;

  @ApiProperty({
    description: 'Column id',
    example: 0,
  })
  column_id: number;

  @ApiProperty({
    description: 'Card index in column',
    example: 0,
  })
  index: number;

  @ApiProperty({
    description: 'Card title',
    example: 'Make dinner',
  })
  title: string;

  @ApiProperty({
    description: 'Card description',
    example: 'Need to make delicious dinner for me',
  })
  description: string;
}
