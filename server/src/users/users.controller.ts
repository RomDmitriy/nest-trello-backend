import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateBodyDto } from './dto/create.dto';
import { JWT } from './dto/jwt.dto';
import {
  ApiBody,
  ApiDefaultResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserIdParamDto } from './dto/userId.dto';
import { UsersUpdateBodyDto } from './dto/update.dto';
import { UsersSignInBodyDto } from './dto/signIn.dto';
import { UserDto } from 'src/database/dto/entity/user.dto';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { UserAccessGuard } from 'src/security/access/user.access.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: UsersCreateBodyDto })
  @ApiResponse({ status: 201, description: 'User created', type: JWT })
  @ApiResponse({
    status: 409,
    description: 'User with this email address already exists',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async signUp(@Body() data: UsersCreateBodyDto): Promise<JWT> {
    try {
      return await this.usersService.signUp(data);
    } catch (err) {
      // Если ошибка уникальности полей
      if (err.code === 'P2002') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      throw new HttpException(
        'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiDefaultResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: UsersSignInBodyDto })
  @ApiResponse({ status: 200, description: 'User found', type: JWT })
  @ApiResponse({
    status: 404,
    description: 'User not found or password is incorrect',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async signIn(@Body() data: UsersSignInBodyDto): Promise<JWT> {
    return this.usersService.signIn(data);
  }

  @Get(':user_id')
  @ApiOperation({ summary: 'Find user by id' })
  @ApiParam({ name: 'user_id' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Param() params: UserIdParamDto,
  ): Promise<Omit<UserDto, 'password'>> {
    const user = await this.usersService.findById(parseInt(params.user_id));
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  @Put(':user_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'user_id' })
  @ApiBody({ type: UsersUpdateBodyDto })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email address already exists',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async update(
    @Param() params: UserIdParamDto,
    @Body() data: UsersUpdateBodyDto,
  ): Promise<void> {
    try {
      return await this.usersService.update(parseInt(params.user_id), data);
    } catch (err) {
      console.log(err);
      // Если ошибка уникальности эл. почты
      if (err.code === 'P2002') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      throw new HttpException(
        'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':user_id')
  @UseGuards(JwtAuthGuard, UserAccessGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiSecurity('bearer')
  @ApiParam({ name: 'user_id' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({
    status: 404,
    description: 'User with this id not found',
  })
  @ApiResponse({ status: 500, description: 'Unknown error' })
  async remove(@Param() params: UserIdParamDto): Promise<void> {
    try {
      return await this.usersService.remove(parseInt(params.user_id));
    } catch (err) {
      // Если пользователь с таким id не найден
      if (err.code === 'P2025')
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      throw new HttpException(
        'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
