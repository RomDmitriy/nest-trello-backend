import { ApiProperty } from '@nestjs/swagger';

export class ColumnDto {
  @ApiProperty({
    description: 'Column id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Column owner id',
    example: 9,
  })
  owner_id: number;

  @ApiProperty({
    description: 'Column name',
    example: 'TO DO',
  })
  name: string;

  @ApiProperty({
    description: 'Column index',
    example: 0,
  })
  index: number;
}
