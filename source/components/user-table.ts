import {customElement} from 'lit-element';
import {NidocaComplexTable} from '../nidoca-complex-table';
import {AuthUserRemoteRepository} from '../repo/auth-user-repository';
import {AuthUser, BasicRemoteRepository} from '@domoskanonos/frontend-basis';

@customElement('user-table')
export class UserTable extends NidocaComplexTable<AuthUser, number> {
  protected getIgnoredKeys(): string[] {
    return ['id', 'password', 'roles'];
  }

  getRemoteRepository(): BasicRemoteRepository<AuthUser, number> {
    return AuthUserRemoteRepository.getUniqueInstance();
  }

  getI18nPrefix(): string {
    return '';
  }

}
