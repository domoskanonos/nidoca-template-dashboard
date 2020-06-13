import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {DefaultPage} from './page-default';

@customElement('page-register-ok')
export class PageRegister extends DefaultPage {
  getMainComponent(): TemplateResult {
    return html`
      <nidoca-register-ok></nidoca-register-ok>
    `;
  }
}
