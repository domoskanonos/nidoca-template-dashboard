import {customElement, html, LitElement, property, PropertyValues, TemplateResult} from 'lit-element';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {HttpResponseCode} from '@domoskanonos/frontend-basis';
import {SecureService, RouterService, I18nService} from '@domoskanonos/frontend-basis';
import {AuthUser, HttpClientService} from '@domoskanonos/frontend-basis/lib';
import {DefaultPage} from './page-default';
import {HttpClientRequest} from '@domoskanonos/frontend-basis/lib/http-client-service';

@customElement('page-my-data')
export class PageMyData extends DefaultPage {
  @property()
  errorMessage: string = '';

  @property()
  user: AuthUser | null = null;

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.user = SecureService.getUniqueInstance().getAuthUser();
  }

  getMainComponent(): TemplateResult {
    return html`
      <nidoca-my-data
        @nidoca-event-my-data-submit="${(event: CustomEvent) => this.register(event)}"
        errorMessage="${this.errorMessage}"
        .user="${this.user}"
      ></nidoca-my-data>
    `;
  }

  private register(event: CustomEvent) {
    let formOutputData: NidocaFormOutputData = event.detail;
    let request: HttpClientRequest = HttpClientService.getDefaultPutRequest();
    request.path = '/SYSTEM/AUTH/UPDATE_USER/'.concat(formOutputData.jsonObject.id);
    request.body = JSON.stringify(formOutputData.jsonObject);
    SecureService.getUniqueInstance()
      .request(request)
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
