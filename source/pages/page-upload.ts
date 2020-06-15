import {customElement, html, LitElement, property, query, TemplateResult} from 'lit-element';
import {guard} from 'lit-html/directives/guard';
import {repeat} from 'lit-html/directives/repeat';
import {SecureService, HttpResponseCode, I18nService} from '@domoskanonos/frontend-basis';
import {NidocaFormOutputData} from '@domoskanonos/nidoca-core';
import {DefaultPage} from './page-default';
import {
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

export enum UploadFileType {
  ALL = 'all',
  PDF = 'pdf',
  IMG = 'img',
  JPEG = 'jpg',
  PNG = 'png',
  GIF = 'gif',
}

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
  maxFileSize: number = 1024;

  @property()
  fileTypes: UploadFileType[] = [UploadFileType.ALL];

  @property()
  headers: any[] = [
    I18nService.getUniqueInstance().getValue('nidoca-upload-list-filename-header'),
    I18nService.getUniqueInstance().getValue('nidoca-upload-list-typ-header'),
    I18nService.getUniqueInstance().getValue('nidoca-upload-list-size-header'),
  ];

  @property()
  rows: any[] = [];

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
            <nidoca-form id="upload-form">
              <nidoca-inputfield
                id="upload-input-element"
                name="upload"
                .multiple="${true}"
                .inputfieldType="${InputfieldType.FILE}"
                .inputfieldMode="${InputfieldMode.CLEAN}"
                required="true"
                accept="image/*"
                @nidoca-event-inputfield-change="${() => this.uploadChanged()}"
                label="${I18nService.getUniqueInstance().getValue('nidoca-upload-upload-label-text')}"
                assistiveText="${I18nService.getUniqueInstance().getValue('nidoca-upload-upload-assistive-text')}"
                infoText="${I18nService.getUniqueInstance().getValue(
                  'nidoca-upload-upload-info-text'
                )} ${this.getAllowedFileTypesI18n()}"
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

              <nidoca-visible visibleType="${this.progress ? VisibleType.NORMAL : VisibleType.HIDE}">
                <nidoca-progress progressType="${ProgressType.PROGRESS_CIRCULAR}"></nidoca-progress>
              </nidoca-visible>

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
            <nidoca-visible visibleType="${this.rows.length > 0 ? VisibleType.NORMAL : VisibleType.HIDE}">
              <nidoca-table .headers="${this.headers}" .rows="${this.rows}"> </nidoca-table>
            </nidoca-visible>
          </nidoca-flex-container>
        </nidoca-grid-container>
      </nidoca-transition>
    `;
  }

  private uploadChanged() {
    this.files = [];
    this.rows = [];
    if (this.formComponent != null) {
      let outputData: NidocaFormOutputData | null = this.formComponent.getOutputData();
      let files: FileList = outputData.jsonObject.upload;
      for (let i = 0; i < files.length; i++) {
        let file: File | null = files.item(i);
        if (file != null) {
          this.rows.push([file.name, this.fileTypeMappging(file.type), file.size / 1024 + ' KB']);
        }
      }
    }
  }

  private upload(event: CustomEvent) {

    this.errorMessage = '';

    this.progress = true;
    let data: any = event.detail;
    console.log('sdsd');
    if (this.formComponent != null) {
      let outputData: NidocaFormOutputData | null = this.formComponent.getOutputData();
      let files: FileList | null = outputData.jsonObject.upload;
      HttpClientService.getUniqueInstance()
        .uploadFiles('/SYSTEM/STORAGE', files)
        .then(value => {
          console.log('files uplaoded: ' + value);
          this.progress = false;
        });
    }
  }

  private fileTypeMappging(type: string): TemplateResult {
    switch (type) {
      case 'application/pdf':
        return html`
          <nidoca-icon icon="picture_as_pdf"></nidoca-icon>
        `;
    }

    return html``;
  }

  private cancelUpload() {
    this.rows = [[]];
  }

  private getAllowedFileTypesI18n(): string {
    let i18nFileTypesString: string = '';
    for (let i = 0; i < this.fileTypes.length; i++) {
      let value = this.fileTypes[i];
      if (i > 0) {
        i18nFileTypesString += i18nFileTypesString.concat(', ');
      }
      i18nFileTypesString += i18nFileTypesString.concat(
        I18nService.getUniqueInstance().getValue('nidoca-upload-filetype-'.concat(value))
      );
    }
    return i18nFileTypesString;
  }
}
