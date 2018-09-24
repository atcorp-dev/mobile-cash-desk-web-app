import { map, switchMap } from 'rxjs/operators';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, from, combineLatest } from 'rxjs';
import { User } from './user.model';
import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {

  public constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User
  ) { }

  // #region Methods: Protected

  protected getUserDto(user: User): UserDto {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      companyId: user.companyId,
      role: user.role
    }
  }

  protected getSalt(): Observable<string> {
    return from (
      bcrypt.genSalt(10)
    );
  }

  protected getHash(str: string, salt: string): Observable<string> {
    return from (
      bcrypt.hash(str, salt)
    );
  }

  protected getEncryptedPassword(password: string): Observable<string> {
    return this.getSalt()
    .pipe(
      switchMap(
        salt => this.getHash(password, salt)
      )
    );
  }

  protected checkPassword(password: string, user: User): Observable<UserDto | null> {
    return from(
      bcrypt.compare(password, user.password)
    ).pipe(
      map(match => {
        if(match) {
          return this.getUserDto(user);
        }
        return null;
      })
    );
  }

  // #endregion

  // #region Methods: Public

  public getAll(): Observable<Array<User>> {
    const response = this.userRepository.findAll();
    return from(response);
  }

  public register(createUser: CreateUserDto): Observable<UserDto> {
    return this.getEncryptedPassword(createUser.password).pipe(
      switchMap(
        password => this.userRepository.create(Object.assign({}, createUser, { password, active: true }))
      ),
      map(user => this.getUserDto(user))
    );
  }

  getUserByLogin(login: string, password: string): Observable<UserDto | null> {
    const userQuery = this.userRepository.findOne({ where: { login } });
    return combineLatest(
      this.getEncryptedPassword(password),
      userQuery,
    )
    .pipe(
      switchMap(([password, user]) => this.checkPassword(password, user)),
      map(res => res)
    )
  }

  // #endregion
}