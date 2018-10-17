import { LoginUserDto } from './../user/dto/login-user.dto';
import { AuthService } from './auth.service';
import { AppAuthGuard } from './../auth/auth.guard';
import { Controller, Post, Req, Res, Session, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiUseTags('Auth')
@Controller('Auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('login')
  // @UseGuards(AppAuthGuard)
  @ApiOperation({ title: 'Authenticate' })
  // @ApiBearerAuth()
  public async login(@Body() loginUser: LoginUserDto, @Req() req, @Res() res, @Session() session) {
    // const user = session.passport.user;
    const { username, password} = loginUser;
    const user  = await this.authService.validateUser({ username, password }).toPromise();
    if (user) {
      req.login(user, () => {
        session.passport.user = user;
        res.status(HttpStatus.OK).send(user);
      });
      return;
    }
    return res.status(HttpStatus.UNAUTHORIZED).send(null);
  }

  @Post('logout')
  @ApiOperation({ title: 'Log Out' })
  public logOut(@Req() request, @Res() response) {
    request.logout();
    return response.status(HttpStatus.OK).send();
  }

  @Post('login')
  @UseGuards(AppAuthGuard)
  @ApiOperation({ title: 'Ping session' })
  @ApiBearerAuth()
  public async ping(@Res() res, @Session() session) {
    const user = session.passport.user;
    return res.status(HttpStatus.OK).send(user);
  }

}
