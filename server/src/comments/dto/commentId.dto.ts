import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CommentsIdParamDto {
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

  @ApiProperty({
    description: 'Comment id',
  })
  @IsNumberString()
  comment_id: string;
}
