import { User } from './user.model';

export const userProviders = [
  {
    provide: 'UserRepository',
    useValue: User
  }
];
