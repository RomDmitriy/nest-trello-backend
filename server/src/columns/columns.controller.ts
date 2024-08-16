import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ColumnsCreateBodyDto } from './dto/create.dto';
import { ColumnDto } from '../database/dto/entity/column.dto';
import { ColumnsUpdateBodyDto } from './dto/update.dto';
import { UserIdParamDto } from 'src/users/dto/userId.dto';
import { UserAccessGuard } from 'src/security/access/user.access.guard';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { ColumnAccessGuard } from 'src/security/access/column.access.guard';
import { UserExistsGuard } from 'src/security/exists/user.exists.guard';
import { ColumnIdParamDto } from './dto/columnId.dto';

@Controller()
@ApiTags('Columns')
@ApiParam({ name: 'user_id' })
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  @UseGuards(UserExistsGuard)
  @ApiOperation({ summary: 'Get all user columns, ordered by index' })
  @ApiResponse({
    status: 200,
    description: 'Columns returned',
    type: ColumnDto,
    isArray: true,
  })
  async getAll(@Param() params: UserIdParamDto): Promise<ColumnDto[]> {
    return this.columnsService.getAll(parseInt(params.user_id));
  }

  @Get(':column_id')
  @UseGuards(UserExistsGuard)
  @ApiParam({ name: 'column_id' })
  @ApiOperation({ summary: 'Get column' })
  @ApiResponse({
    status: 200,
    description: 'Column returned',
    type: ColumnDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Column not found',
  })
  async get(@Param() params: ColumnIdParamDto): Promise<ColumnDto> {
    const column = await this.columnsService.get(parseInt(params.column_id));
    if (column) return column;
    throw new HttpException('Column not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UseGuards(JwtAuthGuard, UserAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Create new column' })
  @ApiResponse({ status: 201, description: 'Column created' })
  @ApiResponse({
    status: 409,
    description: 'That index already exists to current user',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async create(
    @Param() params: UserIdParamDto,
    @Body() data: ColumnsCreateBodyDto,
  ): Promise<ColumnDto> {
    return this.columnsService.create(parseInt(params.user_id), data);
  }

  @Put(':column_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Update column' })
  @ApiParam({ name: 'column_id' })
  @ApiResponse({ status: 200, description: 'Column updated' })
  @ApiResponse({
    status: 404,
    description: 'Column not found',
  })
  @ApiResponse({
    status: 409,
    description: 'That index already exists to current user',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async update(
    @Param() params: ColumnIdParamDto,
    @Body() data: ColumnsUpdateBodyDto,
  ) {
    return this.columnsService.update(parseInt(params.column_id), data);
  }

  @Delete(':column_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Delete column' })
  @ApiParam({ name: 'column_id' })
  @ApiResponse({ status: 200, description: 'Column deleted' })
  @ApiResponse({
    status: 404,
    description: 'Column not found',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async remove(@Param() params: ColumnIdParamDto): Promise<void> {
    return this.columnsService.remove(parseInt(params.column_id));
  }
}
