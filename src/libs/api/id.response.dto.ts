import { ApiProperty } from '@nestjs/swagger';

export class IdResponse<A = string> {
  constructor(id: A) {
    this.id = id?.toString?.() ?? '';
  }

  @ApiProperty({ example: '1' })
  readonly id: string;
}
