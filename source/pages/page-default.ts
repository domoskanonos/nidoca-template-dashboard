import {html, property, TemplateResult} from 'lit-element';
import {I18nService, SecureService} from '@domoskanonos/frontend-basis';
import {TypographyType, NidocaTemplate} from '@domoskanonos/nidoca-core';

export abstract class DefaultPage extends NidocaTemplate {
  @property()
  isAuthenticated: boolean = SecureService.getUniqueInstance().isAuthenticated();

  @property()
  navigationTitle: string = '';

  getTopContent(): TemplateResult {
    return html`
      <nidoca-top-app-bar>
        ${this.getTopLeftComponent()} ${this.getTopMainComponent()} ${this.getTopRightComponent()}
      </nidoca-top-app-bar>
    `;
  }

  getTopLeftComponent(): TemplateResult {
    return html`
      <nidoca-icon
        title="${I18nService.getUniqueInstance().getValue('menu')}"
        slot="leftComponents"
        icon="menu"
        clickable="true"
      ></nidoca-icon>
      <nidoca-typography slot="leftComponents" .typographyType="${TypographyType.BODY1}"
        >${this.navigationTitle}</nidoca-typography
      >
    `;
  }

  getTopMainComponent(): TemplateResult {
    return html``;
  }

  getTopRightComponent(): TemplateResult {
    return html``;
  }

  getLeftNavigationContent(): TemplateResult {
    return html`
      <nidoca-navigation-link
        slot="links"
        icon="dashboard"
        text="${I18nService.getUniqueInstance().getValue('home')}"
        href="dashboard"
      ></nidoca-navigation-link>
      <nidoca-navigation-section
        slot="links"
        text="${I18nService.getUniqueInstance().getValue('section_membership')}"
      ></nidoca-navigation-section>
      <nidoca-navigation-link
        slot="links"
        icon="account_circle"
        text="${I18nService.getUniqueInstance().getValue('login')}"
        href="login"
        .rendered="${!this.isAuthenticated}"
      ></nidoca-navigation-link>
      <nidoca-navigation-link
        slot="links"
        icon="how_to_reg"
        text="${I18nService.getUniqueInstance().getValue('register')}"
        href="register"
        .rendered="${!this.isAuthenticated}"
      ></nidoca-navigation-link>
      <nidoca-navigation-link
        slot="links"
        icon="security"
        text="${I18nService.getUniqueInstance().getValue('reset_password')}"
        href="reset_password"
        .rendered="${!this.isAuthenticated}"
      ></nidoca-navigation-link>
      <nidoca-navigation-link
        slot="links"
        icon="power_settings_new"
        text="${I18nService.getUniqueInstance().getValue('logout')}"
        href="logout"
        .rendered="${this.isAuthenticated}"
      ></nidoca-navigation-link>
      <nidoca-navigation-link
        slot="links"
        icon="vpn_key"
        text="${I18nService.getUniqueInstance().getValue('change_password')}"
        href="change_password"
        .rendered="${this.isAuthenticated}"
      ></nidoca-navigation-link>
      <nidoca-navigation-section
        .rendered="${this.isAuthenticated}"
        slot="links"
        text="${I18nService.getUniqueInstance().getValue('section_search')}"
      ></nidoca-navigation-section>
      <nidoca-divider slot="links"></nidoca-divider>
      <nidoca-navigation-link
        slot="links"
        icon="settings"
        text="${I18nService.getUniqueInstance().getValue('settings')}"
        href="settings"
      ></nidoca-navigation-link>
      <nidoca-navigation-link
        slot="links"
        icon="format_list_numbered"
        text="${I18nService.getUniqueInstance().getValue('terms_of_use')}"
        href="terms_of_use"
      ></nidoca-navigation-link>
    `;
  }
}
