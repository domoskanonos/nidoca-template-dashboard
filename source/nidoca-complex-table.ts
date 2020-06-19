import {css, html, LitElement, property, TemplateResult} from 'lit-element';
import {guard} from 'lit-html/directives/guard';
import {repeat} from 'lit-html/directives/repeat';
import {
  BasicRemoteRepository,
  BasicService,
  I18nService,
  KeyValuePair,
  KeyValuePairs,
  PageableContainer,
  TypescriptType,
} from '@domoskanonos/frontend-basis/lib';
import {
  BorderProperties,
  BorderSize,
  FlexAlignContent,
  FlexAlignItems,
  FlexContainerProperties,
  FlexDirection,
  FlexJustifyContent,
  FlexWrap,
  FormProperties,
  GridAlignItems,
  GridJustifyItems,
  InputfieldMode,
  InputfieldType,
  NidocaInputfield,
  ShadowType,
  SpacerAlignment,
  SpacerSize,
  TypographyType,
  VisibleType,
} from '@domoskanonos/nidoca-core/lib';

export interface NidocaEventComplexTableRow {
  rowIndex: number;
  columnIndex: number;
  row: ComplexTableRow;
}

export class ComplexTableRow {
  model: any;
  rowModel: any[] = [];
}

export class Sort {
  sorted?: boolean;
  unsorted?: boolean;
  empty?: boolean;
}

export class Pageable {
  sort?: Sort;
  offset?: number;
  pageNumber: number = 0;
  pageSize: number = 10;
  unpaged?: boolean;
  paged?: boolean;
}

export class TableContent {
  content: any[] = [];
  pageable: Pageable = Pageable.prototype;
  last?: boolean;
  totalElements: number = 0;
  totalPages: number = 0;
  number?: number;
  size?: number;
  sort?: Sort;
  numberOfElements: number = 1;
  first?: boolean;
  empty?: boolean;
}

export abstract class NidocaComplexTable<T extends Object, S extends Object> extends LitElement {
  static styles = css`
    .header,
    .column {
      width: 100%;
      height: 100%;
    }
    .column {
      cursor: pointer;
    }
    .odd {
      background-color: var(--app-color-surface-background-light);
    }
  `;

  @property()
  rows: ComplexTableRow[] = [];

  @property()
  keys: string[];

  @property()
  page: number = 0;

  @property()
  selectablePages: number[] = [];

  @property()
  size: number = 10;

  searchValues: KeyValuePair[] = [];

  sortValues: KeyValuePair[] = [];

  @property()
  totalElements: number = 0;

  @property()
  totalPages: number = 0;

  @property()
  numberOfElements: number = 0;

  @property()
  gridTemplateRows: string[] = ['1fr'];

  @property()
  gridTemplateColumns: string[] = ['1fr'];

  @property()
  showDecision: boolean = false;

  constructor() {
    super();
    this.keys = this.getPropertyKeys();
  }

  abstract getRemoteRepository(): BasicRemoteRepository<T, S>;

  abstract getI18nPrefix(): string;

  abstract getPropertyTypes(): KeyValuePairs;

  private getPropertyKeys(): string[] {
    return this.getPropertyTypes().getKeys();
  }

  render() {
    return html`
      ${this.renderSearchBar()}
      <nidoca-border
        .borderProperties="${[BorderProperties.ALL, BorderProperties.FULL_WIDTH]}"
        .borderSize="${BorderSize.THIN}"
        .shadowType="${ShadowType.NONE}"
      >
        <nidoca-grid-container
          .gridJustifyItems="${GridJustifyItems.START}"
          .gridAlignItems="${GridAlignItems.CENTER}"
          .gridTemplateRows="${this.gridTemplateRows}"
          .gridTemplateColumns="${this.gridTemplateColumns}"
        >
          ${this.renderHeader()} ${this.renderRows()}
        </nidoca-grid-container>
        ${this.renderNoRecord()}
      </nidoca-border>

      ${this.renderPaging()}

      <nidoca-decision-dialog .showDialog="${this.showDecision}"></nidoca-decision-dialog>
    `;
  }

  private renderHeader(): TemplateResult {
    return html`
      ${guard(
      [this.rows],
      () =>
        html`
            ${repeat(
          this.keys,
          key => html`
                <nidoca-grid-container
                  height="100%"
                  class="header"
                  .gridJustifyItems="${GridJustifyItems.START}"
                  .gridAlignItems="${GridAlignItems.CENTER}"
                  .gridTemplateRows="${['1fr']}"
                  .gridTemplateColumns="${['1fr', 'min-content']}"
                  ><nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" spacerAlignment="${SpacerAlignment.BOTH}">
                    <nidoca-typography .typographyType="${TypographyType.OVERLINE}"
                      >${I18nService.getUniqueInstance().getValue(this.getI18nPrefix().concat(key))}</nidoca-typography
                    ></nidoca-spacer
                  >
                  <nidoca-icon
                    icon="${this.getSortValue(key).value == ''
            ? 'remove'
            : this.getSortValue(key).value == ':asc;'
              ? 'keyboard_arrow_up'
              : 'keyboard_arrow_down'}"
                    @nidoca-event-icon-clicked="${() => {
            this.updateSortValue(key);
          }}"
                    clickable="true"
                  ></nidoca-icon>
                </nidoca-grid-container>
              `,
        )}
          `,
    )}
    `;
  }

  private renderSearchBar(): TemplateResult {
    return html`
      <nidoca-form
        .formProperties="${[FormProperties.ROW_LAYOUT]}"
        @nidoca-event-inputfield-keyup="${(event: CustomEvent) => {
      this.updateSearchValue(event);
    }}"
        @nidoca-event-inputfield-change="${(event: CustomEvent) => {
      this.updateSearchValue(event);
    }}"
      >
        ${guard(
      [this.keys],
      () =>
        html`
              ${repeat(
          this.keys,
          key => html`
                <nidoca-grid-container .gridTemplateRows="${['1fr']}"
                  .gridTemplateColumns="${['1fr', 'min-content']}">
                  ${this.renderSearchColumn(key)}
                  <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" spacerAlignment="${SpacerAlignment.BOTH}">
                </nidoca-grid-container>`,
        )}
            `,
    )}
      </nidoca-form>
    `;
  }

  private renderRows(): TemplateResult {
    return html`
      ${guard(
      [this.rows],
      () =>
        html`
            ${repeat(
          this.rows,
          (row: ComplexTableRow, rowIndex: number) => html`
                ${guard(
            row.rowModel,
            () =>
              html`
                      ${repeat(
                row.rowModel,
                (column, columnIndex) => html`
                          <nidoca-grid-container
                            height="100%"
                            class="column${rowIndex % 2 == 0 ? ' odd' : ' even'}"
                            @click="${() => {
                  this.columnClicked(rowIndex, columnIndex);
                }}"
                            .gridJustifyItems="${GridJustifyItems.START}"
                            .gridAlignItems="${GridAlignItems.CENTER}"
                            .gridTemplateRows="${['1fr']}"
                            .gridTemplateColumns="${['1fr']}"
                          >
                            ${column}
                          </nidoca-grid-container>
                        `,
              )}
                    `,
          )}
              `,
        )}
          `,
    )}
    `;
  }

  private renderPaging(): TemplateResult {
    return html`
      <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" spacerAlignment="${SpacerAlignment.VERTICAL}">
        <nidoca-border
          .borderProperties="${[BorderProperties.ALL]}"
          .borderSize="${BorderSize.THIN}"
          .shadowType="${ShadowType.NONE}"
        >
          <nidoca-grid-container
            .gridJustifyItems="${GridJustifyItems.CENTER}"
            .gridAlignItems="${GridAlignItems.CENTER}"
            .gridTemplateRows="${['auto']}"
            .gridTemplateColumns="${[
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
    ]}"
          >
            <nidoca-icon
              title="${I18nService.getUniqueInstance().getValue('nidoca-complex-table-first-page')}"
              icon="first_page"
              clickable="true"
              @nidoca-event-icon-clicked="${() => {
      this.page = 0;
      this.search();
    }}"
              ;
            ></nidoca-icon>
            <nidoca-border
              .borderProperties="${[BorderProperties.LEFT]}"
              .borderSize="${BorderSize.THIN}"
              .shadowType="${ShadowType.NONE}"
            >
              <nidoca-icon
                title="${I18nService.getUniqueInstance().getValue('nidoca-complex-table-before-page')}"
                icon="navigate_before"
                clickable="true"
                @nidoca-event-icon-clicked="${() => {
      this.previousPage();
    }}"
                ;
              ></nidoca-icon
            ></nidoca-border>
            ${repeat(
      this.selectablePages,
      selectablePage => html`
                <nidoca-border
                  style="${this.page == selectablePage
        ? 'background-color: var(--app-color-surface-background-light);'
        : ''}"
                  .borderProperties="${[BorderProperties.LEFT]}"
                  .borderSize="${BorderSize.THIN}"
                  .shadowType="${ShadowType.NONE}"
                >
                  <nidoca-icon
                    .clickable="${selectablePage > -1}"
                    @nidoca-event-icon-clicked="${() => {
        this.page = selectablePage;
        this.search();
      }}"
                    >${selectablePage + 1}</nidoca-icon
                  ></nidoca-border
                >
              `,
    )}

            <nidoca-border
              .borderProperties="${[BorderProperties.LEFT]}"
              .borderSize="${BorderSize.THIN}"
              .shadowType="${ShadowType.NONE}"
            >
              <nidoca-icon>/${this.totalPages}</nidoca-icon></nidoca-border
            >
            <nidoca-border
              .borderProperties="${[BorderProperties.LEFT]}"
              .borderSize="${BorderSize.THIN}"
              .shadowType="${ShadowType.NONE}"
            >
              <nidoca-icon
                title="${I18nService.getUniqueInstance().getValue('nidoca-complex-table-next-page')}"
                icon="navigate_next"
                clickable="true"
                @nidoca-event-icon-clicked="${() => {
      this.nextPage();
    }}"
                ;
              ></nidoca-icon></nidoca-border
            ><nidoca-border
              .borderProperties="${[BorderProperties.LEFT]}"
              .borderSize="${BorderSize.THIN}"
              .shadowType="${ShadowType.NONE}"
            >
              <nidoca-icon
                title="${I18nService.getUniqueInstance().getValue('nidoca-complex-table-last-page')}"
                icon="last_page"
                clickable="true"
                @nidoca-event-icon-clicked="${() => {
      this.page = this.totalPages - 1;
      this.search();
    }}"
                ;
              ></nidoca-icon
            ></nidoca-border> </nidoca-grid-container
        ></nidoca-border>
      </nidoca-spacer>
    `;
  }

  renderNoRecord(): TemplateResult {
    return html`
      <nidoca-visible visibleType="${this.emptyRows() ? VisibleType.NORMAL : VisibleType.HIDE}">
        <nidoca-flex-container
          .flexContainerProperties="${[FlexContainerProperties.CONTAINER_WIDTH_100]}"
          itemFlexBasisValue="auto"
          .flexDirection="${FlexDirection.COLUMN}"
          .flexWrap="${FlexWrap.WRAP}"
          .flexJustifyContent="${FlexJustifyContent.SPACE_AROUND}"
          .flexAlignItems="${FlexAlignItems.CENTER}"
          .flexAlignContent="${FlexAlignContent.SPACE_AROUND}"
        >
          <nidoca-typography
            .typographyType="${TypographyType.BUTTON}"
            text="${I18nService.getUniqueInstance().getValue('no_entry_found')}"
          ></nidoca-typography>
          <nidoca-spacer .spacerSize="${SpacerSize.SMALL}" spacerAlignment="${SpacerAlignment.BOTH}"> </nidoca-spacer>
        </nidoca-flex-container>
      </nidoca-visible>
    `;
  }

  private toComplexeTableRows(models: T[]): ComplexTableRow[] {
    let rows: ComplexTableRow[] = [];
    if (models != null) {
      for (let i = 0; i < models.length; i++) {
        let row: ComplexTableRow = new ComplexTableRow();
        row.model = models[i];
        row.rowModel = this.toRowModel(row.model);
        rows.push(row);
      }
    }
    return rows;
  }

  protected toRowModel(model: any): any[] {
    let rowModel: any[] = [];
    this.getPropertyTypes().items.forEach((keyValuePair: KeyValuePair) => {
      let typescriptType: TypescriptType = keyValuePair.value;
      let value: any = model[keyValuePair.key];
      switch (typescriptType) {
        case TypescriptType.BOOLEAN:
          rowModel.push(
            html`
              <nidoca-icon icon="${value ? 'done' : 'clear'}"></nidoca-icon>
            `,
          );
          break;
        default:
          rowModel.push(
            html`
              <nidoca-spacer spacerSize="${SpacerSize.SMALL}" spacerAlignment="${SpacerAlignment.BOTH}">
                <nidoca-typography .typographyType="${TypographyType.BODY2}"
                  >${BasicService.getUniqueInstance().beautifyText(value)}</nidoca-typography
                ></nidoca-spacer
              >
            `,
          );
          break;
      }
    });
    return rowModel;
  }

  protected firstUpdated(): void {
    this.search();
  }

  search() {
    this.getRemoteRepository()
      .search(this.page, this.size, this.getSortQueryString(), this.getSearchQueryString())
      .then((pageableContainer: PageableContainer<T>) => {
        console.log('searchRequest successfully, populate results...');
        this.rows = this.toComplexeTableRows(pageableContainer.content);
        this.totalElements = Number(pageableContainer.totalElements);
        this.totalPages = Number(pageableContainer.totalPages);
        this.numberOfElements = Number(pageableContainer.numberOfElements);
        let pageable = pageableContainer.pageable;
        this.page = Number(pageable.pageNumber);
        this.gridTemplateRows = this.getGridTemplateRows();
        this.gridTemplateColumns = this.getGridTemplateColumns();
        this.selectablePages = this.getSelectablePages();
      });
  }

  private getGridTemplateRows() {
    if (this.emptyRows()) {
      return this.gridTemplateRows;
    }
    let gridTemplateRows: string[] = [];
    gridTemplateRows.push('auto'); //headerRow
    for (let i = 0; i < this.rows.length; i++) {
      gridTemplateRows.push('auto');
    }
    return gridTemplateRows;
  }

  private getGridTemplateColumns() {
    if (this.emptyRows()) {
      return this.gridTemplateColumns;
    }
    let gridTemplateColumns: string[] = [];
    Object.keys(this.getRowModel()).forEach(() => {
      gridTemplateColumns.push('auto');
    });
    return gridTemplateColumns;
  }

  private emptyRows() {
    return this.rows == null || this.rows.length == 0;
  }

  private columnClicked(rowIndex: number, columnIndex: number) {
    console.log('column clicked, row: %s, column: %s ', rowIndex, columnIndex);
    BasicService.getUniqueInstance().dispatchSimpleCustomEvent(this, 'nidoca-event-complex-table-column-clicked', <
      NidocaEventComplexTableRow
      >{
      columnIndex: columnIndex,
      rowIndex: rowIndex,
      row: this.rows[rowIndex],
    });
  }

  private previousPage() {
    if (this.page > 0) {
      this.page--;
      this.search();
    }
  }

  private nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.search();
    }
  }

  private getSelectablePages() {
    let selectablePages: number[] = [];
    let size: number = 4;
    let startPage: number = this.page - (this.page == this.totalPages - 1 ? size : size - 1);
    for (let i = startPage; i < this.totalPages; i++) {
      if (i >= 0 && selectablePages.length <= size) {
        selectablePages.push(i);
      }
    }
    return selectablePages;
  }

  private updateSearchValue(event: CustomEvent) {
    let data: KeyValuePair = event.detail;
    this.getSearchValue(data.key).value = data.value;
    this.page = 0;
    this.search();
  }

  private getSearchValue(key: string) {
    for (let data of this.searchValues) {
      if (key == data.key) {
        return data;
      }
    }
    let keyValueData = <KeyValuePair>{};
    keyValueData.key = key;
    keyValueData.value = '';
    this.searchValues.push(keyValueData);
    return keyValueData;
  }

  private getSearchQueryString() {
    let whereClause = '';
    this.searchValues.forEach(searchValue => {
      if (BasicService.getUniqueInstance().isNotBlank(searchValue.value)) {
        whereClause = whereClause
          .concat(searchValue.key)
          .concat('=')
          .concat(BasicService.getUniqueInstance().getValue(searchValue.value, ''));
      }
    });
    if (whereClause.length > 0) {
      whereClause = '&'.concat(whereClause);
    }
    return whereClause;
  }

  private updateSortValue(key: string) {
    let sortValue = this.getSortValue(key);
    let oldValue: string = sortValue.value;
    switch (oldValue) {
      case '':
        sortValue.value = ':desc;';
        break;
      case ':desc;':
        sortValue.value = ':asc;';
        break;
      case ':asc;':
        sortValue.value = '';
        break;
    }
    this.search();
  }

  private getSortValue(key: string) {
    for (let data of this.sortValues) {
      if (key == data.key) {
        return data;
      }
    }
    let keyValuePair = <KeyValuePair>{};
    keyValuePair.key = key;
    keyValuePair.value = '';
    this.sortValues.push(keyValuePair);
    return keyValuePair;
  }

  private getSortQueryString(): string {
    let sortQueryString: string = '';
    this.sortValues.forEach(sortValue => {
      if (BasicService.getUniqueInstance().isNotBlank(sortValue.value)) {
        sortQueryString = sortQueryString.concat(sortValue.key).concat(sortValue.value);
      }
    });
    return sortQueryString;
  }

  private getRowModel() {
    if (this.emptyRows()) {
      return <T>{};
    }
    let firstRow: any[] = this.rows[0].rowModel;
    return firstRow;
  }

  public getInputfieldType(propertyName: string): InputfieldType {
    return NidocaInputfield.inputfieldTypeByTypescriptType(this.getPropertyTypes().getItem(propertyName)?.value);
  }

  private renderSearchColumn(key: string) {
    let typescriptType: TypescriptType = this.getPropertyTypes().getItem(key)?.value;
    switch (typescriptType) {
      case TypescriptType.DATE:
        return html`
          <nidoca-grid-container
            .gridJustifyItems="${GridJustifyItems.START}"
            .gridAlignItems="${GridAlignItems.CENTER}"
            .gridTemplateRows="${['auto']}"
            .gridTemplateColumns="${['auto', 'auto', 'auto']}"
          >
            <nidoca-inputfield
              .value="${new Date()}"
              label="${I18nService.getUniqueInstance().getValue(
          this.getI18nPrefix().concat(key),
        )} ${I18nService.getUniqueInstance().getValue('from')}"
              .inputfieldType="${InputfieldType.DATE}"
              .inputfieldMode="${InputfieldMode.FILLED}"
              name="firstDate"
            ></nidoca-inputfield>
            <nidoca-icon icon="remove"></nidoca-icon>
            <nidoca-inputfield
              .value="${new Date()}"
              label="${I18nService.getUniqueInstance().getValue(
          this.getI18nPrefix().concat(key),
        )} ${I18nService.getUniqueInstance().getValue('to')}"
              .inputfieldType="${InputfieldType.DATE}"
              .inputfieldMode="${InputfieldMode.FILLED}"
              name="secondDate"
            ></nidoca-inputfield>
          </nidoca-grid-container>
        `;
      case TypescriptType.BOOLEAN:
        return html`
          <nidoca-inputfield
            label="${I18nService.getUniqueInstance().getValue(this.getI18nPrefix().concat(key))}"
            inputfieldType="${InputfieldType.COMBOBOX}"
            .inputfieldMode="${InputfieldMode.FILLED}"
            name="${key}"
            .value="${this.getSearchValue(key).value}"
            .options="${[
          <KeyValuePair>{
            key: '',
            value: I18nService.getUniqueInstance().getValue('all'),
          },
          <KeyValuePair>{
            key: 'true',
            value: I18nService.getUniqueInstance().getValue('yes'),
          },
          <KeyValuePair>{
            key: 'false',
            value: I18nService.getUniqueInstance().getValue('no'),
          },
        ]}"
          ></nidoca-inputfield>
        `;
      default:
        return html`
          <nidoca-inputfield
            label="${I18nService.getUniqueInstance().getValue(this.getI18nPrefix().concat(key))}"
            .value="${this.getSearchValue(key).value}"
            .inputfieldType="${this.getInputfieldType(key)}"
            .inputfieldMode="${InputfieldMode.FILLED}"
            name="${key}"
          ></nidoca-inputfield>
        `;
    }
  }
}
