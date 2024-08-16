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
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CardDto } from 'src/database/dto/entity/card.dto';
import { CardsCreateBodyDto } from './dto/create.dto';
import { CardsIdParamDto } from './dto/cardId.dto';
import { CardsUpdateBodyDto } from './dto/update.dto';
import { ColumnAccessGuard } from 'src/security/access/column.access.guard';
import { UserAccessGuard } from 'src/security/access/user.access.guard';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { CardAccessGuard } from 'src/security/access/card.access.guard';
import { UserExistsGuard } from 'src/security/exists/user.exists.guard';
import { ColumnExistsGuard } from 'src/security/exists/column.exists.guard';
import { ColumnIdParamDto } from 'src/columns/dto/columnId.dto';
import { ConflictError, NotFoundError } from 'src/ts/errors';

@Controller()
@ApiTags('Cards')
@ApiParam({ name: 'user_id' })
@ApiParam({ name: 'column_id' })
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @UseGuards(UserExistsGuard, ColumnExistsGuard)
  @ApiOperation({ summary: 'Get cards from column, ordered by index' })
  @ApiResponse({
    status: 200,
    description: 'Cards returned',
    type: CardDto,
    isArray: true,
  })
  async getAll(@Param() params: ColumnIdParamDto): Promise<CardDto[]> {
    return this.cardsService.getAll(parseInt(params.column_id));
  }

  @Get(':card_id')
  @UseGuards(UserExistsGuard, ColumnExistsGuard)
  @ApiOperation({ summary: 'Get card' })
  @ApiParam({ name: 'card_id' })
  @ApiResponse({
    status: 200,
    description: 'Card returned',
    type: CardDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
  })
  async get(@Param() params: CardsIdParamDto): Promise<CardDto> {
    const card = await this.cardsService.get(parseInt(params.card_id));
    if (card) return card;
    throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Create new card' })
  @ApiResponse({ status: 201, description: 'Card created' })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async create(
    @Param() params: ColumnIdParamDto,
    @Body() data: CardsCreateBodyDto,
  ): Promise<CardDto> {
    return this.cardsService.create(parseInt(params.column_id), data);
  }

  @Put(':card_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard, CardAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Update card' })
  @ApiParam({ name: 'card_id' })
  @ApiResponse({ status: 200, description: 'Card updated' })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
  })
  @ApiResponse({
    status: 409,
    description: 'That index already exists to current column',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async update(
    @Param() params: CardsIdParamDto,
    @Body() data: CardsUpdateBodyDto,
  ) {
    try {
      return await this.cardsService.update(parseInt(params.card_id), data);
    } catch (err) {
      if (err instanceof ConflictError) {
        throw new HttpException(err.message, 409);
      } else if (err instanceof NotFoundError) {
        throw new HttpException(err.message, 404);
      }
    }
  }

  @Delete(':card_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard, CardAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Delete card' })
  @ApiParam({ name: 'card_id' })
  @ApiResponse({ status: 200, description: 'Card deleted' })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async remove(@Param() params: CardsIdParamDto): Promise<void> {
    return this.cardsService.remove(parseInt(params.card_id));
  }
}
