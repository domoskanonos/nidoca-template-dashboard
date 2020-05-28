import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {SecureService, HttpResponseCode, I18nService} from '@domoskanonos/frontend-basis';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';

@customElement('page-login')
export class PageLogin extends LitElement {
  @property()
  isAuthenticated: boolean = SecureService.getUniqueInstance().isAuthenticated();

  @property()
  errorMessage: string = '';

  render(): TemplateResult {
    return html`
      <nidoca-authentication
        errorMessage="${this.errorMessage}"
        hrefResetPassword="#reset_password"
        hrefRegister="#register"
        @nidoca-event-authentication-login="${(event: CustomEvent) => this.login(event)}"
        @nidoca-event-authentication-logout="${() => this.logout()}"
        .isAuthenticated="${this.isAuthenticated}"
      ></nidoca-authentication>
    `;
  }

  logout() {
    SecureService.getUniqueInstance()
      .logout('#login')
      .then(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  login(event: CustomEvent) {
    this.errorMessage = '';
    let formOutputData: NidocaFormOutputData = event.detail;
    SecureService.getUniqueInstance()
      .login(formOutputData.formData, '#dashboard', '#error')
      .then(response => {
        console.log(response.status);
        if (response.status == HttpResponseCode.FORBIDDEN || response.status == HttpResponseCode.UNAUTHORIZED) {
          this.errorMessage = I18nService.getUniqueInstance().getValue('page-login-error-wrong-login-data');
        } else if (response.status != HttpResponseCode.OK) {
          this.errorMessage = I18nService.getUniqueInstance().getValue('error_unknown');
        }
      })
      .catch(reason => {
        console.error('error login user: '.concat(reason));
        this.errorMessage = I18nService.getUniqueInstance().getValue('error_unknown');
      });
  }
}
