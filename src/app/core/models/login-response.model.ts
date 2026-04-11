import { User } from './user.model';

export class LoginResponse {
  accessToken: string;
  user: User | null;

  constructor(loginResponse: any) {
    const payload = loginResponse ?? {};
    this.accessToken = payload.accessToken ?? payload.token ?? '';
    this.user =
      payload.user != null ? new User(payload.user) : null;
  }
}
