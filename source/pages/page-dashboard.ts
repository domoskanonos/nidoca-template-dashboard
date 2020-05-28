import {customElement, html, TemplateResult} from 'lit-element';
import {I18nService} from '@domoskanonos/frontend-basis';
import {DefaultPage} from './page-default';

@customElement('page-dashboard')
export class PageDashboard extends DefaultPage {
  constructor() {
    super();
    this.navigationTitle = I18nService.getUniqueInstance().getValue('home');
  }

  private tileClicked() {
    console.log('tile clicked: bankaccount');
  }

  getMainComponent(): TemplateResult {
    return html`
      <app-tile-box-component></app-tile-box-component>
    `;
  }
}
