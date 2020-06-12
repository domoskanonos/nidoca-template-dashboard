import {customElement, html, LitElement, property, PropertyValues, TemplateResult} from 'lit-element';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {HttpResponseCode} from '@domoskanonos/frontend-basis';
import {SecureService, RouterService, I18nService} from '@domoskanonos/frontend-basis';
import {AuthUser} from '@domoskanonos/frontend-basis/lib';

@customElement('page-my-data')
export class PageMyData extends LitElement {

  @property()
  errorMessage: string = '';

  @property()
  user: AuthUser | null = null;

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.user = SecureService.getUniqueInstance().getAuthUser();
  }

  render(): TemplateResult {
    return html`
      <nidoca-my-data
        @nidoca-event-my-data="${(event: CustomEvent) => this.register(event)}"
        errorMessage="${this.errorMessage}"
        .user="${this.user}"
      ></nidoca-my-data>
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
