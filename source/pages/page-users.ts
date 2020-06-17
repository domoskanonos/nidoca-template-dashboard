import {customElement, html, TemplateResult} from 'lit-element';
import {DefaultPage} from './page-default';

@customElement('page-users')
export class PageUsers extends DefaultPage {
  getMainComponent(): TemplateResult {
    return html`
      <user-table></user-table>
    `;
  }
}
