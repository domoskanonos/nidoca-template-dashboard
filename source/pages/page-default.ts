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
  GridJustifyItems,
  TypographyAlignment,
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
        .flexDirection="${FlexDirection.ROW}"
        .flexWrap="${FlexWrap.WRAP}"
        .flexJustifyContent="${FlexJustifyContent.SPACE_AROUND}"
        .flexAlignItems="${FlexAlignItems.CENTER}"
        .flexAlignContent="${FlexAlignContent.SPACE_AROUND}"
      >
        ${this.renderActionIcon(true, 'dashboard', 'home', 'home')}
        ${this.renderActionIcon(true, 'people', 'users', 'users')}
        ${this.renderActionIcon(!this.isAuthenticated, 'account_circle', 'login', 'login')}
        ${this.renderActionIcon(!this.isAuthenticated, 'how_to_reg', 'register', 'register')}
        ${this.renderActionIcon(!this.isAuthenticated, 'security', 'reset_password', 'reset_password')}
        ${this.renderActionIcon(this.isAuthenticated, 'face', 'my-data', 'mydata')}
        ${this.renderActionIcon(true, 'backup', 'upload', 'upload')}
        ${this.renderActionIcon(true, 'code', 'barcode', 'barcode')}
        ${this.renderActionIcon(true, 'camera', 'camera', 'camera')}
        ${this.renderActionIcon(this.isAuthenticated, 'power_settings_new', 'logout', 'logout')}
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
      ${this.renderLink(true, 'dashboard', 'home', 'dashboard')}
      <nidoca-navigation-section
        slot="links"
        text="${I18nService.getUniqueInstance().getValue('section_membership')}"
      ></nidoca-navigation-section>
      ${this.renderLink(!this.isAuthenticated, 'account_circle', 'login', 'login')}
      ${this.renderLink(!this.isAuthenticated, 'how_to_reg', 'register', 'register')}
      ${this.renderLink(!this.isAuthenticated, 'security', 'reset_password', 'reset_password')}
      ${this.renderLink(this.isAuthenticated, 'face', 'my-data', 'mydata')}
      ${this.renderLink(this.isAuthenticated, 'power_settings_new', 'logout', 'logout')}
      ${this.renderLink(this.isAuthenticated, 'vpn_key', 'change_password', 'change_password')}
      <nidoca-divider slot="links"></nidoca-divider>
      ${this.renderLink(true, 'settings', 'settings', 'settings')}
      ${this.renderLink(true, 'format_list_numbered', 'terms_of_use', 'terms_of_use')}
    `;
  }

  private renderLink(rendered: boolean, icon: string, textKey: string, href: string): TemplateResult {
    return html`
      <nidoca-navigation-link
        slot="links"
        icon="${icon}"
        text="${I18nService.getUniqueInstance().getValue(textKey)}"
        href="${href}"
        .rendered="${rendered}"
      ></nidoca-navigation-link>
    `;
  }

  private renderActionIcon(
    isAuthenticated: boolean,
    icon: string,
    i18nKey: string,
    href: string
  ): TemplateResult {
    return isAuthenticated
      ? html`
          <nidoca-icon-action
            @nidoca-event-icon-clicked="${() => {
              RouterService.getUniqueInstance().navigate(href);
            }}"
            text="${I18nService.getUniqueInstance().getValue(i18nKey)}"
            icon="${icon}"
            .active="${RouterService.getUniqueInstance().getCurrentPage() == href}"
          >
          </nidoca-icon-action>
        `
      : html``;
  }
}
