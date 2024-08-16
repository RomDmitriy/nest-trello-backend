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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ColumnAccessGuard } from 'src/security/access/column.access.guard';
import { UserAccessGuard } from 'src/security/access/user.access.guard';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { CardAccessGuard } from 'src/security/access/card.access.guard';
import { CommentsService } from './comments.service';
import { CommentsIdParamDto } from './dto/commentId.dto';
import { CardsIdParamDto } from 'src/cards/dto/cardId.dto';
import { CommentsCreateBodyDto } from './dto/create.dto';
import { CommentAccessGuard } from 'src/security/access/comment.access.guard';
import { CommentsUpdateBodyDto } from './dto/update.dto';
import { UserExistsGuard } from 'src/security/exists/user.exists.guard';
import { ColumnExistsGuard } from 'src/security/exists/column.exists.guard';
import { CardExistsGuard } from 'src/security/exists/card.exists.guard';
import { CommentDto } from 'src/database/dto/entity/comment.dto';

@Controller()
@ApiTags('Comments')
@ApiParam({ name: 'user_id' })
@ApiParam({ name: 'column_id' })
@ApiParam({ name: 'card_id' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @UseGuards(UserExistsGuard, ColumnExistsGuard, CardExistsGuard)
  @ApiOperation({ summary: 'Get comments from card, ordered by datetime' })
  @ApiResponse({
    status: 200,
    description: 'Comments returned',
    type: CommentDto,
    isArray: true,
  })
  async getAll(@Param() params: CardsIdParamDto): Promise<CommentDto[]> {
    return this.commentsService.getAll(parseInt(params.card_id));
  }

  @Get(':comment_id')
  @UseGuards(UserExistsGuard, ColumnExistsGuard, CardExistsGuard)
  @ApiOperation({ summary: 'Get comment' })
  @ApiParam({ name: 'comment_id' })
  @ApiResponse({
    status: 200,
    description: 'Comment found',
    type: CommentDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  async get(@Param() params: CommentsIdParamDto): Promise<CommentDto> {
    const comment = await this.commentsService.get(parseInt(params.comment_id));
    if (comment) return comment;
    throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard, CardAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async create(
    @Param() params: CardsIdParamDto,
    @Body() data: CommentsCreateBodyDto,
    @Request() req: Request,
  ): Promise<CommentDto> {
    return this.commentsService.create(
      parseInt(params.card_id),
      //@ts-expect-error чтобы не переопределять типизацию
      req.user.userId,
      data,
    );
  }

  @Put(':comment_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard, CardAccessGuard)
  @UseGuards(CommentAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'comment_id' })
  @ApiResponse({ status: 200, description: 'Comment updated' })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async update(
    @Param() params: CommentsIdParamDto,
    @Body() data: CommentsUpdateBodyDto,
  ) {
    return this.commentsService.update(parseInt(params.comment_id), data);
  }

  @Delete(':comment_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard, ColumnAccessGuard, CardAccessGuard)
  @UseGuards(CommentAccessGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'comment_id' })
  @ApiResponse({ status: 200, description: 'Comment deleted' })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async remove(
    @Param()
    params: CommentsIdParamDto,
  ): Promise<void> {
    return this.commentsService.remove(parseInt(params.comment_id));
  }
}
