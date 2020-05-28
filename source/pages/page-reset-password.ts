import {SecureService} from '@domoskanonos/frontend-basis';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {TemplateResult, html, customElement, LitElement, property} from 'lit-element';
import {I18nService} from '@domoskanonos/frontend-basis/lib';

@customElement('page-reset-password')
export class PageResetPassword extends LitElement {
  @property()
  errorMessage: string = '';

  render(): TemplateResult {
    return html`
      <nidoca-reset-password
        errorMessage="${this.errorMessage}"
        @nidoca-event-reset-password="${(event: CustomEvent) => this.resetPassword(event)}"
      ></nidoca-reset-password>
    `;
  }

  private resetPassword(event: CustomEvent) {
    let formOutputData: NidocaFormOutputData = event.detail;
    SecureService.getUniqueInstance()
      .sendFormData('/SYSTEM/AUTH/RESET_PASSWORD', formOutputData.formData, null)
      .catch(reason => {
        console.error('error reset password: '.concat(reason));
        this.errorMessage = I18nService.getUniqueInstance().getValue('nidoca-reset-password-error');
      });
  }
}
