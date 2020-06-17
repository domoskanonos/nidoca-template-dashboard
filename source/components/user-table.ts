import {customElement} from 'lit-element';
import {NidocaComplexTable} from '../nidoca-complex-table';

@customElement('user-table')
export class UserTable extends NidocaComplexTable {

  getRows(): any[][] {

    return [["ssss","ssss"],["ss","xxxxx"]];
  }


}
