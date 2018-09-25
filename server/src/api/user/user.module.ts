import { DatabaseModule } from './../../database/database.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProviders } from './user.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    ...userProviders
  ],
  exports: [
    UserService
  ]
})
export class UserModule { }