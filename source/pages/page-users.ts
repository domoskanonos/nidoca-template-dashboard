import {customElement, html, TemplateResult} from 'lit-element';
import {DefaultPage} from './page-default';
import {
  FlexAlignContent,
  FlexAlignItems,
  FlexContainerProperties,
  FlexDirection,
  FlexJustifyContent,
  FlexWrap,
  TypographyType,
} from '@domoskanonos/nidoca-core/lib';
import {I18nService} from '@domoskanonos/frontend-basis/lib';
import {NidocaEventComplexTableRow} from '../nidoca-complex-table';

@customElement('page-users')
export class PageUsers extends DefaultPage {
  getMainComponent(): TemplateResult {
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
        .flexAlignItems="${FlexAlignItems.START}"
        .flexAlignContent="${FlexAlignContent.SPACE_AROUND}"
      >
        <nidoca-typography .typographyType="${TypographyType.H2}"
          >${I18nService.getUniqueInstance().getValue('users')}</nidoca-typography
        >
        <user-table
          @nidoca-event-complex-table-column-clicked="${(event: CustomEvent) => {
            this.editUser(event);
          }}"
        ></user-table>
      </nidoca-flex-container>
    `;
  }

  private editUser(event: CustomEvent) {
    let data: NidocaEventComplexTableRow = event.detail;
  }
}
