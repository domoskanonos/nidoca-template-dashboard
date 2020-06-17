import {css, html, property, query, TemplateResult, LitElement} from 'lit-element';
import {guard} from 'lit-html/directives/guard';
import {repeat} from 'lit-html/directives/repeat';
import {BasicService, I18nService, PageableContainer} from '@domoskanonos/frontend-basis/lib';
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
  ShadowType,
  SpacerAlignment,
  SpacerSize,
  TypographyType,
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

export abstract class NidocaComplexTable<T> extends LitElement {
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

  @property()
  sort: string = '';

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

  abstract async searchRequest(): Promise<PageableContainer<T>>;

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
    this.searchRequest().then((pageableContainer: PageableContainer<T>) => {
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
            ${guard(
              [this.keys],
              () =>
                html`
                  ${repeat(
                    this.keys,
                    header => html`
                      <nidoca-grid-container
                        height="100%"
                        class="header"
                        .gridJustifyItems="${GridJustifyItems.START}"
                        .gridAlignItems="${GridAlignItems.CENTER}"
                        .gridTemplateRows="${['1fr']}"
                        .gridTemplateColumns="${['1fr']}"
                        ><nidoca-spacer spacerSize="${SpacerSize.MEDIUM}" spacerAlignment="${SpacerAlignment.BOTH}">
                          <nidoca-typography .typographyType="${TypographyType.OVERLINE}"
                            >${header}</nidoca-typography
                          ></nidoca-spacer
                        >
                      </nidoca-grid-container>
                    `
                  )}
                `
            )}
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
                                  <nidoca-spacer
                                    spacerSize="${SpacerSize.MEDIUM}"
                                    spacerAlignment="${SpacerAlignment.BOTH}"
                                  >
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
          </nidoca-grid-container></nidoca-border
        >

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
      return this.gridTemplateRows;
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
}
