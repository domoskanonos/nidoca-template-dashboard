import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {RouterService, SecureService} from '@domoskanonos/frontend-basis';
import {HttpResponseCode} from '@domoskanonos/frontend-basis';

@customElement('page-change-password')
export class PageChangePassword extends LitElement {
  render(): TemplateResult {
    return html`
      <nidoca-change-password
        @nidoca-event-change-password="${(event: CustomEvent) => this.changePassword(event)}"
      ></nidoca-change-password>
    `;
  }

  private changePassword(event: CustomEvent) {
    let formOutputData: NidocaFormOutputData = event.detail;
    SecureService.getUniqueInstance()
      .sendFormData('/SYSTEM/AUTH/UPDATE_PASSWORD', formOutputData.formData, null)
      .then((response: Response) => {
        if (response.status == HttpResponseCode.OK) {
          RouterService.getUniqueInstance().navigate('#changepasswordok');
        }
      });
  }
}
