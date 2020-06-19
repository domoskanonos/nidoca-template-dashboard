import {customElement} from 'lit-element';
import {NidocaComplexTable} from '../nidoca-complex-table';
import {AuthUserRemoteRepository} from '../repo/auth-user-repository';
import {AuthUser, BasicRemoteRepository} from '@domoskanonos/frontend-basis';
import {TypescriptType, KeyValuePair, KeyValuePairs} from '@domoskanonos/frontend-basis/lib';

@customElement('user-table')
export class UserTable extends NidocaComplexTable<AuthUser, number> {
  getRemoteRepository(): BasicRemoteRepository<AuthUser, number> {
    return AuthUserRemoteRepository.getUniqueInstance();
  }

  getI18nPrefix(): string {
    return '';
  }

  getPropertyTypes(): KeyValuePairs {
    let propertyTypes: KeyValuePairs = new KeyValuePairs();
    propertyTypes.push(<KeyValuePair>{key: 'email', value: TypescriptType.STRING});
    propertyTypes.push(<KeyValuePair>{key: 'firstName', value: TypescriptType.STRING});
    propertyTypes.push(<KeyValuePair>{key: 'lastName', value: TypescriptType.STRING});
    propertyTypes.push(<KeyValuePair>{key: 'birthday', value: TypescriptType.DATE});
    propertyTypes.push(<KeyValuePair>{key: 'active', value: TypescriptType.BOOLEAN});
    return propertyTypes;
  }

}
