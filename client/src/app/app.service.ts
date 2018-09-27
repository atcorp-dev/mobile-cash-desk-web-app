import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  private _currentUser: any;
  public set currentUser(user) {
    this._currentUser = user;
  }
  public get currentUser(): any {
    return this._currentUser;
  }
}
