import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length, Max, Min } from 'class-validator';

export class ColumnsUpdateBodyDto {
  @IsOptional()
  @ApiProperty({
    description: 'Column name',
    minLength: 1,
    maxLength: 24,
  })
  @Length(1, 24)
  name?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Column index',
    minimum: -32768,
    maximum: 32767,
  })
  @Min(-32768)
  @Max(32767)
  index?: number;
}
