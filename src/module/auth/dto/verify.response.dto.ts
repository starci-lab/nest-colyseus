import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponseDto {
  @ApiProperty({
    example: '',
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    example: '',
    description: 'Refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: '',
    description: 'Wallet Address',
  })
  wallet_address: string;
}
