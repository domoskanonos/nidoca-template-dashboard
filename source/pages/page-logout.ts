import {customElement, html, property, TemplateResult} from 'lit-element';
import {SecureService} from '@domoskanonos/frontend-basis';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {DefaultPage} from './page-default';
import {FlexContainerProperties} from '@domoskanonos/nidoca-core';

@customElement('page-logout')
export class PageLogout extends DefaultPage {
  @property()
  isAuthenticated: boolean = SecureService.getUniqueInstance().isAuthenticated();

  getMainComponent(): TemplateResult {
    return html`
      <nidoca-flex-container
        .flexContainerProperties="${[
          FlexContainerProperties.CONTAINER_WIDTH_50,
          FlexContainerProperties.SMARTPHONE_MAX_WIDTH,
          FlexContainerProperties.SMARTPHONE_HORIZONTAL_PADDING,
        ]}"
        flexItemBasisValue="100%"
      >
        <nidoca-authentication
          @nidoca-event-authentication-event-login="${(event: CustomEvent) => this.login(event)}"
          @nidoca-event-authentication-event-logout="${() => this.logout()}"
          .isAuthenticated="${this.isAuthenticated}"
        ></nidoca-authentication>
      </nidoca-flex-container>
    `;
  }

  logout() {
    SecureService.getUniqueInstance().logout('#login');
  }

  login(event: CustomEvent) {
    let formOutputData: NidocaFormOutputData = event.detail;
    SecureService.getUniqueInstance().login(formOutputData.formData, '#dashboard', '#login');
  }
}
