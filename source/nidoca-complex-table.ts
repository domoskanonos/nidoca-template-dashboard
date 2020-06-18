import {css, html, property, query, TemplateResult, LitElement} from 'lit-element';
import {guard} from 'lit-html/directives/guard';
import {repeat} from 'lit-html/directives/repeat';
import {
  AuthUser,
  BasicRemoteRepository,
  BasicService,
  I18nService,
  PageableContainer,
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
  GridAlignItems,
  GridJustifyItems,
  InputfieldType,
  KeyValueData,
  ShadowType,
  SpacerAlignment,
  SpacerSize,
  TypographyType,
  VisibleType,
} from '@domoskanonos/nidoca-core/lib';
import {AuthUserRemoteRepository} from './repo/auth-user-repository';

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

export abstract class NidocaComplexTable<T, S> extends LitElement {
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
  keys: string[] = [];

  @property()
  page: number = 0;

  @property()
  selectablePages: number[] = [];

  @property()
  size: number = 10;

  searchValues: KeyValueData[] = [];

  sortValues: KeyValueData[] = [];

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

  protected firstUpdated(): void {
    this.search();
  }

  abstract getRemoteRepository(): BasicRemoteRepository<T, S>;

  protected getIgnoredKeys(): string[] {
    return [];
  }

  protected getKeys() {
    if (this.emptyRows()) {
      return this.keys;
    }
    let firstRow: T = this.rows[0].model;
    let keys: string[] = [];
    Object.keys(firstRow).forEach((key: string) => {
      if (!this.getIgnoredKeys().includes(key)) {
        keys.push(key);
      }
    });
    return keys;
  }

  protected toRowModel(model: any): any[] {
    let rowModel: any[] = [];
    Object.keys(model).forEach((key: string) => {
      if (!this.getIgnoredKeys().includes(key)) {
        rowModel.push(
          html`
            <nidoca-typography .typographyType="${TypographyType.BODY2}"
              >${BasicService.getUniqueInstance().beautifyText(model[key])}</nidoca-typography
            >
          `
        );
      }
    });
    return rowModel;
  }

  search() {
    this.getRemoteRepository()
      .search(this.page, this.size, this.getSortQueryString(), this.getSearchQueryString())
      .then((pageableContainer: PageableContainer<T>) => {
        console.log('searchRequest successfully, populate results...');
        this.rows = this.toComplexeTableRows(pageableContainer.content);
        this.keys = this.getKeys();
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
      >
        <nidoca-border
          .borderProperties="${[BorderProperties.ALL]}"
          .borderSize="${BorderSize.THIN}"
          .shadowType="${ShadowType.NONE}"
        >
          <nidoca-grid-container
            .gridJustifyItems="${GridJustifyItems.START}"
            .gridAlignItems="${GridAlignItems.CENTER}"
            .gridTemplateRows="${this.gridTemplateRows}"
            .gridTemplateColumns="${this.gridTemplateColumns}"
          >
            ${this.renderHeader()} ${this.renderSearchBar()} ${this.renderRows()}
          </nidoca-grid-container>
          ${this.renderNoRecord()}
        </nidoca-border>

        ${this.renderPaging()}
      </nidoca-flex-container>
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
    let firstRow: any[] = this.rows[0].rowModel;
    let gridTemplateColumns: string[] = [];
    Object.keys(firstRow).forEach(() => {
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
    let data: KeyValueData = event.detail;
    this.getSearchValue(data.key).value = data.value;
    this.search();
  }

  private getSearchValue(key: string) {
    for (let data of this.searchValues) {
      if (key == data.key) {
        return data;
      }
    }
    let keyValueData = new KeyValueData();
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
    let keyValueData = new KeyValueData();
    keyValueData.key = key;
    keyValueData.value = '';
    this.sortValues.push(keyValueData);
    return keyValueData;
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

  private renderSearchBar(): TemplateResult {
    return html`
      ${guard(
        [this.keys],
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
                  .gridTemplateColumns="${['1fr']}"
                  ><nidoca-spacer spacerSize="${SpacerSize.LITTLE}" spacerAlignment="${SpacerAlignment.BOTH}">
                    <nidoca-inputfield
                      .value="${this.getSearchValue(key).value}"
                      .inputfieldType="${InputfieldType.TEXT}"
                      name="${key}"
                      @nidoca-event-inputfield-keyup="${(event: CustomEvent) => {
                        this.updateSearchValue(event);
                      }}"
                      >${key}</nidoca-inputfield
                    ></nidoca-spacer
                  >
                </nidoca-grid-container>
              `
            )}
          `
      )}
    `;
  }

  private renderHeader(): TemplateResult {
    return html`
      ${guard(
        [this.keys],
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
                      >${key}</nidoca-typography
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
              `
            )}
          `
      )}
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
                            <nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" spacerAlignment="${SpacerAlignment.BOTH}">
                              ${column}
                            </nidoca-spacer>
                          </nidoca-grid-container>
                        `
                      )}
                    `
                )}
              `
            )}
          `
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
              `
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
}
