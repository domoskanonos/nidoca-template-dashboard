import {css, customElement, html, LitElement, property} from 'lit-element';
import {
  FlexAlignContent,
  FlexAlignItems,
  FlexContainerProperties,
  FlexDirection,
  FlexJustifyContent,
  FlexWrap,
  TypographyAlignment,
  TypographyType,
} from '@domoskanonos/nidoca-core/lib';

@customElement('nidoca-icon-action')
export class NidocaIconAction extends LitElement {
  static styles = css``;

  @property()
  text: string = '';

  @property()
  icon: string = '';

  @property()
  active: boolean = false;

  render() {
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
            style="color:${this.active ? 'var(--app-color-secondary-background)' : ''}"
          >
            <nidoca-icon
              .withIconSpace="${false}"
              icon="${this.icon}"
              title="${this.text}"
              clickable="true" 
            ></nidoca-icon>
            <nidoca-typography
              .typographyType="${TypographyType.CAPTION}"
              typographyAlignment="${TypographyAlignment.CENTER}"
              >${this.text}</nidoca-typography
            ><slot></slot>
          </nidoca-flex-container>
        
      </div>
    `;
  }
}
