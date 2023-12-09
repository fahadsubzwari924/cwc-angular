import { User } from './user.model';

export class LoginResponse {
  accessToken: string;
  user: User;

  constructor(loginResponse: any) {
    this.accessToken = loginResponse.accessToken;
    this.user = new User(loginResponse.user);
  }
}
