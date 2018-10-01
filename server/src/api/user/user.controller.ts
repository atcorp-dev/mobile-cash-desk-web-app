import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { Observable } from 'rxjs';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AppAuthGuard } from '../auth/auth.guard';

@ApiUseTags('Users')
@Controller('Users')
export class UserController {

  constructor(private userService: UserService) { }

  @Get()
  @UseGuards(AppAuthGuard)
  @ApiOperation({ title: 'Get List of All Users' })
  @ApiResponse({ status: 200, description: 'User Found.' })
  @ApiResponse({ status: 404, description: 'No Users found.' })
  @ApiBearerAuth()
  getAll(): Observable<Array<User>> {
    return this.userService.getAll();
  }

  @Post('')
  @UseGuards(AppAuthGuard)
  @ApiOperation({ title: 'Create User' })
  @ApiBearerAuth()
  public create(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

}