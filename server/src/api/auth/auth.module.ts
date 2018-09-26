import { CookieSerializer } from './cookie.serializer';
import { AppAuthGuard } from './auth.guard';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'bearer' }),
    UserModule
  ],
  providers: [
    AuthService,
    HttpStrategy,
    AppAuthGuard,
    CookieSerializer
  ],
})
export class AuthModule { }