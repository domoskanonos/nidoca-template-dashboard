import {customElement} from 'lit-element';
import {NidocaComplexTable} from '../nidoca-complex-table';
import {AuthUserRemoteRepository} from '../repo/auth-user-repository';
import {AuthUser, PageableContainer} from '@domoskanonos/frontend-basis/lib';

@customElement('user-table')
export class UserTable extends NidocaComplexTable<AuthUser> {

  async searchRequest(): Promise<PageableContainer<AuthUser>> {
    return AuthUserRemoteRepository.getUniqueInstance().search(this.page, this.size, this.sort, '');
  }

  protected getIgnoredKeys(): string[] {
    return ['id', 'password', 'roles'];
  }

}
