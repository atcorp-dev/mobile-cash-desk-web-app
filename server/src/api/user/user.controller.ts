import { CompanyIdPipe } from './../pipes/company-id.pipe';
import { ReqUser } from './user.decorator';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './user.model';
import { Observable } from 'rxjs';
import { Controller, Get, Post, Body, UseGuards, Param, ForbiddenException } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AppAuthGuard } from '../auth/auth.guard';

@ApiUseTags('Users')
@Controller('Users')
export class UserController {

  constructor(private userService: UserService) { }

  @Get()
  @UseGuards(AppAuthGuard)
  @ApiOperation({
      title: 'Get List of All Users',
      description: 'To be able to access this method current user must have Admin role'
  })
  @ApiBearerAuth()
  getAll(@ReqUser() user: User): Observable<Array<User>> {
    if (!user || user.role !== UserRole.Admin) {
      throw new ForbiddenException('Not enough permission');
    }
    return this.userService.getAll();
  }

  @Get(':companyId')
  @UseGuards(AppAuthGuard)
  @ApiOperation({
    title: 'Get List of Users for specified company'
  })
  @ApiBearerAuth()
  getAllByCompany(@Param('companyId', new CompanyIdPipe()) companyId: string): Observable<Array<User>> {
    return this.userService.getAllByCompany(companyId);
  }

  @Post('')
  @UseGuards(AppAuthGuard)
  @ApiOperation({
    title: 'Register new user',
    description: 'To be able to register new User current user must have Admin role'
  })
  @ApiBearerAuth()
  public create(@Body() createUser: CreateUserDto, @ReqUser() user: User) {
    if (!user || user.role !== UserRole.Admin) {
      throw new ForbiddenException('Not enough permission');
    }
    return this.userService.register(createUser);
  }

  @Post(':userId/changePassword')
  @UseGuards(AppAuthGuard)
  @ApiOperation({ title: 'Change user password' })
  @ApiBearerAuth()
  public changePassword(@Param('userId') userId: string,@Body() changeUserPasswordDto: ChangeUserPasswordDto) {
    return this.userService.changePassword(userId, changeUserPasswordDto);
  }

}