import {customElement, html, property, query, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {guard} from 'lit-html/directives/guard';
import {SecureService, I18nService} from '@domoskanonos/frontend-basis';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {DefaultPage} from './page-default';
import {
  FlexAlignContent,
  FlexAlignItems,
  FlexContainerProperties,
  FlexDirection,
  FlexJustifyContent,
  FlexWrap,
  GridAlignItems,
  GridJustifyItems,
  InputfieldMode,
  InputfieldType,
  NidocaForm,
  NidocaInputfield,
  ProgressType,
  SpacerAlignment,
  SpacerSize,
  TransitionType,
  TypographyType,
  VisibleType,
} from '@domoskanonos/nidoca-core/lib';
import {BasicService, HttpClientService} from '@domoskanonos/frontend-basis/lib';

@customElement('page-upload')
export class PageUpload extends DefaultPage {
  @property()
  isAuthenticated: boolean = SecureService.getUniqueInstance().isAuthenticated();

  @property()
  errorMessage: string = '';

  @query('#upload-form')
  formComponent: NidocaForm | undefined;

  @query('#upload-input-element')
  inputElement: NidocaInputfield | undefined;

  @property()
  files: File[] = [];

  @property()
  maxSize: number = 1024;

  @property()
  accept: string = '*/*';

  @property()
  progress: boolean = false;

  constructor() {
    super();
    this.showTopBar = false;
  }

  getMainComponent(): TemplateResult {
    return html`
      <nidoca-transition .transitionType="${TransitionType.CENTER}">
        <nidoca-grid-container
          .gridJustifyItems="${GridJustifyItems.CENTER}"
          .gridAlignItems="${GridAlignItems.START}"
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
              icon="backup"
              .withIconSpace="${false}"
              clickable="true"
              @nidoca-event-icon-clicked="${() => {
                this.inputElement?.inputElemet?.click();
              }}"
            ></nidoca-icon>
            <nidoca-spacer
              style="text-align:center;"
              spacerSize="${SpacerSize.MEDIUM}"
              .spacerAlignment="${SpacerAlignment.VERTICAL}"
            >
              <nidoca-typography .typographyType="${TypographyType.H4}"
                >${I18nService.getUniqueInstance().getValue('nidoca-upload-header')}</nidoca-typography
              >
            </nidoca-spacer>

            <nidoca-visible visibleType="${this.progress ? VisibleType.NORMAL : VisibleType.INVISIBLE}">
              <nidoca-progress progressType="${ProgressType.PROGRESS}"></nidoca-progress>
            </nidoca-visible>

            <nidoca-form id="upload-form">
              <nidoca-inputfield
                id="upload-input-element"
                name="upload"
                .multiple="${true}"
                .inputfieldType="${InputfieldType.FILE}"
                .inputfieldMode="${InputfieldMode.CLEAN}"
                required="true"
                accept="${this.accept}"
                max-size="${this.maxSize}"
                @nidoca-event-inputfield-change="${() => this.uploadChanged()}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-upload-upload-label-text')}"
                assistiveText="${I18nService.getUniqueInstance().getValue('nidoca-upload-upload-assistive-text')}${this
      .maxSize}"
                infoText="${I18nService.getUniqueInstance().getValue('nidoca-upload-upload-info-text')} ${this.accept}"
              ></nidoca-inputfield>
              <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" .spacerAlignment="${SpacerAlignment.VERTICAL}">
                <nidoca-button
                  text="${I18nService.getUniqueInstance().getValue('nidoca-upload-submit')}"
                  @nidoca-event-button-clicked="${(event: CustomEvent) => this.upload(event)}"
                ></nidoca-button>
              </nidoca-spacer>
              <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" .spacerAlignment="${SpacerAlignment.VERTICAL}">
                <nidoca-button
                  text="${I18nService.getUniqueInstance().getValue('nidoca-upload-cancel-submit')}"
                  @nidoca-event-button-clicked="${() => this.cancelUpload()}"
                ></nidoca-button>
              </nidoca-spacer>
              <nidoca-visible
                slot="errorMessages"
                visibleType="${BasicService.getUniqueInstance().isNotBlank(this.errorMessage)
      ? VisibleType.NORMAL
      : VisibleType.HIDE}"
              >
                <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" .spacerAlignment="${SpacerAlignment.VERTICAL}">
                  <nidoca-typography
                    .typographyType="${TypographyType.OVERLINE}"
                    text="${this.errorMessage}"
                  ></nidoca-typography>
                </nidoca-spacer>
              </nidoca-visible>
            </nidoca-form>

            <nidoca-visible visibleType="${this.files.length > 0 ? VisibleType.NORMAL : VisibleType.HIDE}">
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
                ${guard(
      [this.files],
      () => html`
                    ${repeat(
        this.files,
        (file: File) =>
          html`
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
                            ${this.fileTypeMappging(file.type)}
                            <nidoca-typography .typographyType="${TypographyType.CAPTION}"
                              >${file.name}
                            </nidoca-typography>
                          </nidoca-flex-container>
                        `,
      )}
                  `,
    )}
              </nidoca-flex-container>
            </nidoca-visible>
          </nidoca-flex-container>
        </nidoca-grid-container>
      </nidoca-transition>
    `;
  }

  private uploadChanged() {
    this.files = [];
    if (this.formComponent != null) {
      let outputData: NidocaFormOutputData | null = this.formComponent.getOutputData();
      let files: FileList = outputData.jsonObject.upload;
      for (let i = 0; i < files.length; i++) {
        let file: File | null = files.item(i);
        if (file != null) {
          this.files.push(file);
        }
      }
    }
  }

  private upload(event: CustomEvent) {
    this.errorMessage = '';

    if (this.files.length == 0) {
      this.errorMessage = I18nService.getUniqueInstance().getValue('nidoca-upload-error-no-files-selected');
    }

    let data: any = event.detail;
    if (this.formComponent != null && this.formComponent.validate()) {
      this.progress = true;
      let outputData: NidocaFormOutputData | null = this.formComponent.getOutputData();
      let files: FileList | null = outputData.jsonObject.upload;
      HttpClientService.getUniqueInstance()
        .uploadFiles('/SYSTEM/STORAGE', files)
        .then(value => {
          console.log('files uplaoded: ' + value);
          this.progress = false;
        })
        .catch(reason => {
          console.error('error during upload file... '.concat(reason));
          this.progress = false;
        });
    }
  }

  private cancelUpload() {
    this.files = [];
  }

  private fileTypeMappging(type: string): TemplateResult {
    switch (type) {
      case 'application/pdf':
        return html`
          <nidoca-icon icon="picture_as_pdf"></nidoca-icon>
        `;
      case 'application/zip':
        return html`
          <nidoca-icon icon="folder"></nidoca-icon>
        `;
      case 'image/bmp':
      case 'image/fif':
      case 'image/tiff':
      case 'image/gif':
      case 'image/png':
      case 'image/jpeg':
        return html`
          <nidoca-icon icon="image"></nidoca-icon>
        `;
    }
    return html`
          <nidoca-icon icon="attachment"></nidoca-icon>
    `;
  }
}
