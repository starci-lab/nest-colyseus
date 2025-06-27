import { Injectable } from '@nestjs/common';
import { UserRepository } from './database/user.repository';
import { UserPaginatedResponseDto } from './dto/user.paginated.response.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { PaginatedQueryBaseDto } from '@libs/api/paginated.querybase.dto';
import { parseMongooseQuery } from '@libs/utils/parse-mongoose-query.util';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async getPaginatedUsers(
    query: PaginatedQueryBaseDto,
  ): Promise<UserPaginatedResponseDto> {
    const parsedQuery = parseMongooseQuery(query);
    const paginated = await this.repo.findPaginated(parsedQuery);

    const data = paginated.data.map((doc) => {
      const dto = new UserResponseDto({
        id: doc._id,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      });

      dto.wallet_address = doc.wallet_address;
      dto.nickname = doc.nickname;
      dto.last_active_at = doc.last_active_at;

      return dto;
    });

    return new UserPaginatedResponseDto({
      data,
      count: paginated.count,
      limit: paginated.limit,
      page: paginated.page,
    });
  }
}
