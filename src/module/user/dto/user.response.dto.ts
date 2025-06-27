import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '01x',
    description: 'Địa chỉ ví',
  })
  wallet_address: string;

  @ApiProperty({
    example: 'abc',
    description: 'Nick name người chơi',
  })
  nickname: string;

  @ApiProperty({
    example: new Date(),
    description: 'Lần cuối hoạt động',
  })
  last_active_at: Date;
}
