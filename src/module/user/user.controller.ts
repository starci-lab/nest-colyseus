import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { UserPaginatedResponseDto } from './dto/user.paginated.response.dto';
import { UserService } from './user.service';
import { FindUserQueryDto } from './query/find-user.query.dto';

@ApiTags('User')
@Controller(routesV1.version)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  @ApiOperation({ summary: 'Get user' })
  @Get(routesV1.user.getUser)
  getUser(@Query() query: FindUserQueryDto): Promise<UserPaginatedResponseDto> {
    return this.userService.getPaginatedUsers(query);
  }
}
