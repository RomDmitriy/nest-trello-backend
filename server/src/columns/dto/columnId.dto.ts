import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ColumnIdParamDto {
  @ApiProperty({
    description: 'Column id',
  })
  @IsNumberString()
  column_id: string;

  @ApiProperty({
    description: 'User id',
  })
  @IsNumberString()
  user_id: string;
}
