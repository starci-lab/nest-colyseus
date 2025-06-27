import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items', isArray: true })
  readonly data: readonly T[];

  @ApiProperty({ description: 'Total number of items', example: 100 })
  readonly count: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  readonly limit: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  readonly page: number;

  constructor(props: {
    data: readonly T[];
    count: number;
    limit: number;
    page: number;
  }) {
    this.data = props.data;
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
  }
}
