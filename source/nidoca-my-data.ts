import {customElement, html, LitElement, property, query} from 'lit-element';
import {BasicService, I18nService} from '@domoskanonos/frontend-basis';
import {NidocaForm, TypographyType, InputfieldType} from '@domoskanonos/nidoca-core';
import {
  BorderProperties,
  BorderSize,
  ButtonType,
  FlexAlignItems,
  FlexContainerProperties,
  FlexDirection,
  FlexJustifyContent,
  FlexWrap,
  GridAlignItems,
  GridJustifyItems,
  InputfieldMode,
  ShadowType,
  SpacerAlignment,
  SpacerSize,
  TransitionType,
} from '@domoskanonos/nidoca-core/lib';
import {AuthUser} from '@domoskanonos/frontend-basis/lib';

@customElement('nidoca-my-data')
export class NidocaChangePassword extends LitElement {
  @property()
  errorMessage: string = '';

  @query('#my-data-form')
  formComponent: NidocaForm | undefined;

  @property()
  user: AuthUser | null = null;

  @property()
  showDeleteDialog: boolean = false;

  render() {
    return html`
      <nidoca-transition .transitionType="${TransitionType.CENTER}">
        <nidoca-grid-container
          .gridJustifyItems="${GridJustifyItems.CENTER}"
          .gridAlignItems="${GridAlignItems.CENTER}"
          .gridTemplateRows="${['1fr']}"
          .gridTemplateColumns="${['1fr']}"
          height="100vh"
        >
          <nidoca-flex-container
            style="width: 400px;"
            .flexContainerProperties="${[
              FlexContainerProperties.CONTAINER_WIDTH_100,
              FlexContainerProperties.SMARTPHONE_MAX_WIDTH,
              FlexContainerProperties.SMARTPHONE_HORIZONTAL_PADDING,
            ]}"
            flexItemBasisValue="auto"
            .flexDirection="${FlexDirection.COLUMN}"
            .flexWrap="${FlexWrap.NO_WRAP}"
            .flexJustifyContent="${FlexJustifyContent.SPACE_AROUND}"
            .flexAlignItems="${FlexAlignItems.STRETCH}"
          >
            <nidoca-icon
              color="var(--app-color-primary-background)"
              size="128"
              icon="face"
              .withIconSpace="${false}"
            ></nidoca-icon>
            <nidoca-spacer
              style="text-align:center;"
              spacerSize="${SpacerSize.MEDIUM}"
              .spacerAlignment="${SpacerAlignment.VERTICAL}"
            >
              <nidoca-typography .typographyType="${TypographyType.H4}"
                >${I18nService.getUniqueInstance().getValue('nidoca-my-data-header')}</nidoca-typography
              >
            </nidoca-spacer>
            <nidoca-form id="my-data-form">
              <nidoca-inputfield
                .inputfieldType="${InputfieldType.TEXT}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-my-data-first-name-label')}"
                required="true"
                name="firstName"
                value="${this.user?.firstName}"
              ></nidoca-inputfield>

              <nidoca-inputfield
                .inputfieldType="${InputfieldType.TEXT}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-my-data-last-name-label')}"
                required="true"
                name="lastName"
                value="${this.user?.lastName}"
              ></nidoca-inputfield>

              <nidoca-inputfield
                .inputfieldType="${InputfieldType.SWITCH}"
                assistiveText="${I18nService.getUniqueInstance().getValue('nidoca-my-data-active-assistive-text')}"
                inputfieldMode="${InputfieldMode.CLEAN}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-my-data-active-label')}"
                name="active"
                value="${this.user?.active}"
              ></nidoca-inputfield>

              <nidoca-inputfield
                .inputfieldType="${InputfieldType.DATE}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-my-data-birthday-label')}"
                required="true"
                name="birthday"
                value="${this.user?.birthday}"
              ></nidoca-inputfield>

              <nidoca-inputfield
                .inputfieldType="${InputfieldType.EMAIL}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-my-data-email-label')}"
                required="true"
                disabled="true"
                name="email"
                value="${this.user?.email}"
              ></nidoca-inputfield>

              <nidoca-inputfield
                .inputfieldType="${InputfieldType.TEXT}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-my-data-city-label')}"
                name="city"
                value="${BasicService.getUniqueInstance().getValue(this.user?.city, '')}"
              ></nidoca-inputfield>

              <nidoca-button
                text="${I18nService.getUniqueInstance().getValue('nidoca-my-data-submit')}"
                @click="${() => this.updateUser()}"
              ></nidoca-button>

              <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" .spacerAlignment="${SpacerAlignment.VERTICAL}">
                <nidoca-button
                  .buttonType="${ButtonType.SECONDARY}"
                  text="${I18nService.getUniqueInstance().getValue('nidoca-my-data-delete-user-submit')}"
                  @click="${() => this.deleteUser()}"
                ></nidoca-button>
              </nidoca-spacer>

              <nidoca-typography
                slot="errorMessages"
                .typographyType="${TypographyType.OVERLINE}"
                text="${this.errorMessage}"
              ></nidoca-typography> </nidoca-form
          ></nidoca-flex-container> </nidoca-grid-container
      ></nidoca-transition>
      <nidoca-decision-dialog
        @nidoca-event-decision-dialog-ok="${() => {
          BasicService.getUniqueInstance().dispatchSimpleCustomEvent(this, 'nidoca-event-my-data-delete-user-submit');
          this.showDeleteDialog = false;
        }}"
        @nidoca-event-decision-dialog-cancel="${() => {
          this.showDeleteDialog = false;
        }}"
        .showDialog="${this.showDeleteDialog}"
        title="${I18nService.getUniqueInstance().getValue('nidoca-my-data-delete-user-dialog-title')}"
        description="${I18nService.getUniqueInstance().getValue('nidoca-my-data-delete-user-dialog-description')}"
      >
      </nidoca-decision-dialog>
    `;
  }

  private updateUser() {
    this.errorMessage = '';
    if (this.formComponent != null && this.formComponent.validate()) {
      BasicService.getUniqueInstance().dispatchSimpleCustomEvent(
        this,
        'nidoca-event-my-data-submit',
        this.formComponent.getOutputData()
      );
    }
  }

  private deleteUser() {
    this.errorMessage = '';
    if (this.formComponent != null) {
      this.showDeleteDialog = true;
    }
  }
}
