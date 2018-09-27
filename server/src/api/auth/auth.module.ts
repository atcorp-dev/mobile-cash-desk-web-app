import { CookieSerializer } from './cookie.serializer';
import { AppAuthGuard } from './auth.guard';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'bearer' }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HttpStrategy,
    AppAuthGuard,
    CookieSerializer
  ],
})
export class AuthModule { }