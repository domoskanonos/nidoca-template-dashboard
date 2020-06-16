import {html, property, TemplateResult} from 'lit-element';
import {I18nService, SecureService} from '@domoskanonos/frontend-basis';
import {TypographyType} from '@domoskanonos/nidoca-core';
import {NidocaDashboardTemplate} from '../nidoca-template-dashboard';
import {
  FlexAlignContent,
  FlexAlignItems,
  FlexContainerProperties,
  FlexDirection,
  FlexJustifyContent,
  FlexWrap,
  GridAlignItems,
  GridJustifyItems, TypographyAlignment,
  VisibleType,
} from '@domoskanonos/nidoca-core/lib';
import {RouterService} from '@domoskanonos/frontend-basis/lib';

export abstract class DefaultPage extends NidocaDashboardTemplate {
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

  getBottomContent(): TemplateResult {
    return html`
      <nidoca-flex-container
        .flexContainerProperties="${[
          FlexContainerProperties.CONTAINER_WIDTH_100,
      FlexContainerProperties.CONTAINER_HEIGHT_100,
    ]}"
        .flexItemProperties="${[]}"
        flexItemBasisValue="auto"
        .flexDirection="${FlexDirection.COLUMN}"
        .flexWrap="${FlexWrap.WRAP}"
        .flexJustifyContent="${FlexJustifyContent.SPACE_AROUND}"
        .flexAlignItems="${FlexAlignItems.CENTER}"
        .flexAlignContent="${FlexAlignContent.SPACE_AROUND}"
      >
        ${this.renderBottomContentMenuIcon(true, 'dashboard', 'home', 'home')}
        ${this.renderBottomContentMenuIcon(!this.isAuthenticated, 'account_circle', 'login', 'login')}
        ${this.renderBottomContentMenuIcon(!this.isAuthenticated, 'how_to_reg', 'register', 'register')}
        ${this.renderBottomContentMenuIcon(!this.isAuthenticated, 'security', 'reset_password', 'reset_password')}
        ${this.renderBottomContentMenuIcon(this.isAuthenticated, 'face', 'my-data', 'mydata')}
        ${this.renderBottomContentMenuIcon(true, 'backup', 'upload', 'upload')}
        ${this.renderBottomContentMenuIcon(this.isAuthenticated, 'power_settings_new', 'logout', 'logout')}
      </nidoca-flex-container>
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
      <nidoca-box slot="links" height="var(--menubar-height)" width="100%">
        <nidoca-grid-container
          .gridJustifyItems="${GridJustifyItems.START}"
          .gridAlignItems="${GridAlignItems.CENTER}"
          .gridTemplateRows="${['1fr']}"
          .gridTemplateColumns="${['auto', '1fr']}"
          height="100%"
        >
          <nidoca-icon icon="dashboard" size="28" color="var(--app-color-secondary-background)"></nidoca-icon>
          <nidoca-typography .typographyType="${TypographyType.H4}">Dashboard</nidoca-typography>
        </nidoca-grid-container>
      </nidoca-box>

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
        icon="face"
        text="${I18nService.getUniqueInstance().getValue('my-data')}"
        href="mydata"
        .rendered="${this.isAuthenticated}"
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

  private renderBottomContentMenuIcon(
    isAuthenticated: boolean,
    icon: string,
    i18nKey: string,
    href: string
  ): TemplateResult {
    return isAuthenticated
      ? html`
          <nidoca-grid-container
            .gridJustifyItems="${GridJustifyItems.CENTER}"
            .gridAlignItems="${GridAlignItems.CENTER}"
            .gridTemplateRows="${['1fr', '1fr']}"
            .gridTemplateColumns="${['auto']}"
          >
            <nidoca-icon
              .withIconSpace="${false}"
              icon="${icon}"
              title="${I18nService.getUniqueInstance().getValue(i18nKey)}"
              clickable="true"
              @nidoca-event-icon-clicked="${() => {
                RouterService.getUniqueInstance().navigate(href);
              }}"
            ></nidoca-icon>
            <nidoca-typography .typographyType="${TypographyType.CAPTION}" typographyAlignment="${TypographyAlignment.CENTER}"
              >${I18nService.getUniqueInstance().getValue(i18nKey)}</nidoca-typography
            >
          </nidoca-grid-container>
        `
      : html``;
  }
}
