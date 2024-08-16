import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './security/strategies/jwt.strategy';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: new ConfigService().get('JWT_SECRET') || 'abc',
      signOptions: { expiresIn: '60d' },
    }),
    UsersModule,
    ColumnsModule,
    CardsModule,
    CommentsModule,
    RouterModule.register([
      {
        path: 'users/:user_id/columns',
        module: ColumnsModule,
      },
      {
        path: 'users/:user_id/columns/:column_id/cards',
        module: CardsModule,
      },
      {
        path: 'users/:user_id/columns/:column_id/cards/:card_id/comments',
        module: CommentsModule,
      },
    ]),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
