import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class UserIdParamDto {
  @ApiProperty({
    description: 'User id',
  })
  @IsNumberString()
  user_id: string;
}
