import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {
  FlexAlignItems,
  FlexContainerProperties,
  FlexDirection,
  FlexJustifyContent,
  FlexWrap,
  SpacerAlignment,
  SpacerSize,
  TransitionType,
  TypographyType,
} from '@domoskanonos/nidoca-core/lib';
import {I18nService} from '@domoskanonos/frontend-basis/lib';
import {DefaultPage} from './page-default';

@customElement('page-terms-of-use')
export class PageTermsOfUse extends DefaultPage {
  getMainComponent(): TemplateResult {
    return html`
      <nidoca-transition .transitionType="${TransitionType.CENTER}">
        <nidoca-flex-container
          style="width: 400px;"
          .flexContainerProperties="${[
            FlexContainerProperties.CONTAINER_WIDTH_75,
            FlexContainerProperties.SMARTPHONE_MAX_WIDTH,
            FlexContainerProperties.SMARTPHONE_HORIZONTAL_PADDING,
          ]}"
          flexItemBasisValue="auto"
          .flexDirection="${FlexDirection.COLUMN}"
          .flexWrap="${FlexWrap.NO_WRAP}"
          .flexJustifyContent="${FlexJustifyContent.SPACE_AROUND}"
          .flexAlignItems="${FlexAlignItems.FLEX_START}"
        >
          <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" .spacerAlignment="${SpacerAlignment.VERTICAL}">
            <nidoca-typography .typographyType="${TypographyType.H2}"
              >${I18nService.getUniqueInstance().getValue('page-terms-of-use-header')}</nidoca-typography
            >
          </nidoca-spacer></nidoca-flex-container
        ></nidoca-transition
      >
    `;
  }
}
