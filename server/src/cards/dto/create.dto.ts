import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CardsCreateBodyDto {
  @ApiProperty({
    description: 'Card id',
    example: 0,
  })
  @IsNumber()
  column_id: number;

  @ApiProperty({
    description: 'Card title',
    example: 'Fix PRJ-1323 ticker',
  })
  @Length(4, 64)
  title: string;

  @ApiProperty({
    description: 'Card description',
    example:
      'Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in. Would day nor ask walls known. But preserved advantage are but and certainty earnestly enjoyment. Passage weather as up am exposed. And natural related man subject. Eagerness get situation his was delighted. Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warmly put branch people narrow see. Winding its waiting yet parlors married own feeling. Marry fruit do spite jokes an times. Whether at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten.',
  })
  @IsString()
  description: string;
}
