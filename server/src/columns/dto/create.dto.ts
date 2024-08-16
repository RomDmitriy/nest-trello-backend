import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class ColumnsCreateBodyDto {
  @ApiProperty({
    description: 'Column name',
    minLength: 1,
    maxLength: 24,
  })
  @Length(1, 24)
  name: string;
}
