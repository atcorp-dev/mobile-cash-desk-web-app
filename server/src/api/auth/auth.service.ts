import { Observable } from 'rxjs';

import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  validateUser(user: { username: string, password: string }): Observable<any> {
    return this.userService.authenticateUser(user);
  }
}