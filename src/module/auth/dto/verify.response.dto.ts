import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponseDto {
  @ApiProperty({
    example: '',
    description: 'Access token',
  })
  access_token: string;

  @ApiProperty({
    example: '',
    description: 'Refresh token',
  })
  refresh_token: string;

  @ApiProperty({
    example: '',
    description: 'Wallet Address',
  })
  wallet_address: string;
}
