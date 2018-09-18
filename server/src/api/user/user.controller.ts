import { User } from './user.model';
import { Observable } from 'rxjs';
import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiUseTags('Users')
@Controller('Users')
export class UserController {

  constructor(private userService: UserService) { }

    @Get()
    getAll(): Observable<Array<User>> {
      return this.userService.getAll();
    }
}