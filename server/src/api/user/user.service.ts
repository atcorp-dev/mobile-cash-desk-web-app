import { Observable, from } from 'rxjs';
import { User } from './user.model';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UserService {

  public constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User
  ) { }

  getAll(): Observable<Array<User>> {
    const response = this.userRepository.findAll();
    return from(response);
  }
}