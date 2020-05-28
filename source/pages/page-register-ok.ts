import {customElement, html, LitElement, TemplateResult} from 'lit-element';

@customElement('page-register-ok')
export class PageRegister extends LitElement {
  render(): TemplateResult {
    return html`
      <nidoca-register-ok></nidoca-register-ok>
    `;
  }
}
