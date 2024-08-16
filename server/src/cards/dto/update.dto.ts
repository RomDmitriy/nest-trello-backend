import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CardsUpdateBodyDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Card id',
    example: 0,
  })
  column_id: number;

  @Length(4, 64)
  @IsOptional()
  @ApiProperty({
    description: 'Card title',
    example: 'Fix PRJ-1323 ticker',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Card description',
    example:
      'Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in. Would day nor ask walls known. But preserved advantage are but and certainty earnestly enjoyment. Passage weather as up am exposed. And natural related man subject. Eagerness get situation his was delighted. Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warmly put branch people narrow see. Winding its waiting yet parlors married own feeling. Marry fruit do spite jokes an times. Whether at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten.',
  })
  description?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Card index',
    minimum: -32768,
    maximum: 32767,
  })
  @Min(-32768)
  @Max(32767)
  index?: number;
}
