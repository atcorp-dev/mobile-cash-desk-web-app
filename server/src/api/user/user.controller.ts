import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { Observable } from 'rxjs';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiUseTags('Users')
@Controller('Users')
export class UserController {

  constructor(private userService: UserService) { }

  @Get()
  @ApiOperation({ title: 'Get List of All Users' })
  @ApiResponse({ status: 200, description: 'User Found.' })
  @ApiResponse({ status: 404, description: 'No Users found.' })
  getAll(): Observable<Array<User>> {
    return this.userService.getAll();
  }

  @Post('')
  @ApiOperation({ title: 'Create User' })
  public create(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

}