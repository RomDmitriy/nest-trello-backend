import { ApiProperty } from '@nestjs/swagger';

export class JWT {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNzIzNzM1NzgwLCJleHAiOjE3Mjg5MTk3ODB9.K_sGGru399XdbG1a1FOlMwm3P02Cmnwi29i27haKwjM',
  })
  access_token: string;
}
