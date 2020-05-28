import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {HttpResponseCode} from '@domoskanonos/frontend-basis';
import {SecureService, RouterService, I18nService} from '@domoskanonos/frontend-basis';

@customElement('page-register')
export class PageRegister extends LitElement {
  @property()
  errorMessage: string = '';

  render(): TemplateResult {
    return html`
      <nidoca-register
        @nidoca-event-register-submit="${(event: CustomEvent) => this.register(event)}"
        errorMessage="${this.errorMessage}"
        hrefTermsOfUse="#terms_of_use"
        hrefLogin="#login"
      ></nidoca-register>
    `;
  }

  private register(event: CustomEvent) {
    let formOutputData: NidocaFormOutputData = event.detail;
    SecureService.getUniqueInstance()
      .sendFormData('/SYSTEM/AUTH/REGISTER', formOutputData.formData, null)
      .then(response => {
        if (response.status == HttpResponseCode.OK) {
          RouterService.getUniqueInstance().navigate('registerok');
        } else {
          this.errorMessage = I18nService.getUniqueInstance().getValue('nidoca-nidoca-register-error');
        }
      })
      .catch(reason => {
        console.error('error register user: '.concat(reason));
        this.errorMessage = I18nService.getUniqueInstance().getValue('nidoca-nidoca-register-error');
      });
  }
}
