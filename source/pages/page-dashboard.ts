import {customElement, html, LitElement, TemplateResult} from 'lit-element';

@customElement('page-dashboard')
export class PageDashboard extends LitElement {
  render(): TemplateResult {
    return html` <div>Startseite</div> `;
  }
}
