import {HttpClientService, BasicRemoteRepository} from '@domoskanonos/frontend-basis';
import {AuthUser} from '@domoskanonos/frontend-basis';

export class AuthUserRemoteRepository extends BasicRemoteRepository<AuthUser, number> {

  private static uniqueInstance: AuthUserRemoteRepository;

  constructor() {
    super(HttpClientService.getUniqueInstance(), '/SYSTEM/AUTH/AUTHUSER');
  }

  static getUniqueInstance() {
    if (!AuthUserRemoteRepository.uniqueInstance) {
      AuthUserRemoteRepository.uniqueInstance = new AuthUserRemoteRepository();
    }
    return AuthUserRemoteRepository.uniqueInstance;
  }

}