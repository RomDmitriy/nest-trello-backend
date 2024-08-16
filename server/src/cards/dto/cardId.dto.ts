import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CardsIdParamDto {
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

  @ApiProperty({
    description: 'Card id',
  })
  @IsNumberString()
  card_id: string;
}
