import { AppAuthGuard } from './../auth/auth.guard';
import { Controller, Post, Req, Res, Session, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiUseTags('Auth')
@Controller('Auth')
export class AuthController {

  @Post('login')
  @UseGuards(AppAuthGuard)
  @ApiOperation({ title: 'Authenticate' })
  @ApiBearerAuth()
  public login(@Res() res, @Session() session) {
    const user = session.passport.user;
    return res.status(HttpStatus.OK).send(user);
  }

  @Post('logout')
  @ApiOperation({ title: 'Log Out' })
  public logOut(@Req() request, @Res() response) {
    request.logout();
    return response.status(HttpStatus.OK).send();
  }

}
