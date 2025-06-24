import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    example: '01xx',
    description: 'Message',
  })
  message: string;
}
