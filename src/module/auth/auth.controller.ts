import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessageResponseDto } from './dto/message.response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token.request.dto';
import { VerifyRequestDto } from './dto/verify.request.dto';
import { VerifyResponseDto } from './dto/verify.response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';

@ApiTags('Authentication')
@Controller(routesV1.version)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageResponseDto,
  })
  @ApiOperation({ summary: 'Get message' })
  @Get(routesV1.auth.message)
  getMessage(): Promise<MessageResponseDto> {
    return this.authService.generateMessage();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: VerifyResponseDto,
  })
  @ApiOperation({ summary: 'Verify signature' })
  @Post(routesV1.auth.verify)
  verifySignature(@Body() body: VerifyRequestDto): Promise<VerifyResponseDto> {
    return this.authService.verifySignature(
      body.message,
      body.signature,
      body.address,
    );
  }

  @Post(routesV1.auth.refreshToken)
  refresh(@Body() body: RefreshTokenRequestDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: 'Logout Successfully',
  })
  @ApiOperation({ summary: 'Logout' })
  @Post(routesV1.auth.logout)
  logout(@Body() body: { wallet_address: string }) {
    return this.authService.logout(body.wallet_address);
  }
}
