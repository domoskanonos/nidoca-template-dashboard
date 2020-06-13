import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {
  TypographyType,
  FlexJustifyContent,
  KeyValueData,
  SpacerSize,
  SpacerAlignment,
  FlexAlignItems,
  FlexContainerProperties,
} from '@domoskanonos/nidoca-core';
import {I18nService, LanguageKey} from '@domoskanonos/frontend-basis';
import {DividerType} from '@domoskanonos/nidoca-core/lib';
import {RouterService} from '@domoskanonos/frontend-basis/lib';
import {DefaultPage} from './page-default';

@customElement('page-settings')
export class PageSettings extends DefaultPage {
  getMainComponent(): TemplateResult {
    return html`
      <nidoca-spacer spacerSize="${SpacerSize.LITTLE}"></nidoca-spacer>
      <nidoca-flex-container
        .flexContainerProperties="${[
          FlexContainerProperties.CONTAINER_WIDTH_50,
          FlexContainerProperties.SMARTPHONE_MAX_WIDTH,
          FlexContainerProperties.SMARTPHONE_HORIZONTAL_PADDING,
        ]}"
        flexItemBasisValue="auto"
        .flexJustifyContent="${FlexJustifyContent.FLEX_START}"
        .flexAlignItems="${FlexAlignItems.CENTER}"
      >
        <nidoca-icon
          icon="arrow_back"
          clickable="true"
          .withIconSpace="${false}"
          @nidoca-event-icon-clicked="${() => RouterService.getUniqueInstance().back()}"
        ></nidoca-icon>
        <nidoca-spacer spacerSize="${SpacerSize.SMALL}" spacerAlignment="${SpacerAlignment.HORIZONTAL}"></nidoca-spacer>
        <nidoca-typography .typographyType="${TypographyType.H3}"
          >${I18nService.getUniqueInstance().getValue('settings')}</nidoca-typography
        >
      </nidoca-flex-container>
      <nidoca-spacer spacerSize="${SpacerSize.LITTLE}" spacerAlignment="${SpacerAlignment.VERTICAL}">
        <nidoca-divider opacity="0.2" .dividerType="${DividerType.THIN}"></nidoca-divider>
      </nidoca-spacer>
      <nidoca-flex-container
        .flexContainerProperties="${[
          FlexContainerProperties.CONTAINER_WIDTH_50,
          FlexContainerProperties.SMARTPHONE_MAX_WIDTH,
          FlexContainerProperties.SMARTPHONE_HORIZONTAL_PADDING,
        ]}"
        flexItemBasisValue="100%"
        .flexJustifyContent="${FlexJustifyContent.FLEX_START}"
        .alignItems="${FlexAlignItems.CENTER}"
      >
        <nidoca-spacer spacerSize="${SpacerSize.LITTLE}" spacerAlignment="${SpacerAlignment.VERTICAL}">
          <nidoca-typography .typographyType="${TypographyType.H6}"
            >${I18nService.getUniqueInstance().getValue('settings_language')}</nidoca-typography
          >
        </nidoca-spacer>

        <nidoca-i18n-selector
          label="${I18nService.getUniqueInstance().getValue('component_i18n_label')}"
          langKey="${I18nService.getUniqueInstance().getLanguage()}"
          .languages="${[
            <KeyValueData>{
              key: LanguageKey.DE,
              value: I18nService.getUniqueInstance().getValue('component_i18n_de'),
            },
            <KeyValueData>{
              key: LanguageKey.EN,
              value: I18nService.getUniqueInstance().getValue('component_i18n_en'),
            },
          ]}"
        ></nidoca-i18n-selector>
      </nidoca-flex-container>
    `;
  }
}
