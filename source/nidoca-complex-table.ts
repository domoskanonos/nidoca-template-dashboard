import {css, html, property, query, TemplateResult, LitElement} from 'lit-element';
import {guard} from 'lit-html/directives/guard';
import {repeat} from 'lit-html/directives/repeat';
import {AuthUser, BasicService, I18nService, PageableContainer} from '@domoskanonos/frontend-basis/lib';
import {GridAlignItems, GridJustifyItems} from '@domoskanonos/nidoca-core/lib';

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
  static styles = css``;

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
        rowModel.push(BasicService.getUniqueInstance().beautifyText(model[key]));
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
      Seite ${String(this.page + 1)} von ${this.totalPages} ${this.renderPaging()}

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
                  <span class="head">
                    ${header}
                  </span>
                `,
        )}
            `,
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
                            <span
                              @click="${() => {
                  this.columnClicked(rowIndex, columnIndex);
                }}"
                            >
                              ${column}
                            </span>
                          `,
              )}
                      `,
          )}
                `,
        )}
            `,
    )}
      </nidoca-grid-container>
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
    let selectablePages: number[] = [
      this.page - 5,
      this.page - 4,
      this.page - 3,
      this.page - 2,
      this.page - 1,
      this.page,
      this.page + 1,
      this.page + 2,
      this.page + 3,
      this.page + 4,
      this.page + 5,
    ];
    while (selectablePages[0] < 0) {
      for (let index = 0; index < selectablePages.length; index++) {
        let value = selectablePages[index];
        selectablePages[index] = value + 1;
      }
    }

    for (let index = selectablePages.length; index > 0; index--) {
      if (selectablePages[index] > this.totalPages - 1) {
        selectablePages.splice(index, 1);
      }
    }

    return selectablePages;
  }

  private renderPaging(): TemplateResult {
    return html`
      <nidoca-grid-container
        .gridJustifyItems="${GridJustifyItems.CENTER}"
        .gridAlignItems="${GridAlignItems.START}"
        .gridTemplateRows="${['1fr']}"
        .gridTemplateColumns="${[
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
      '1fr',
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
        <nidoca-icon
          title="${I18nService.getUniqueInstance().getValue('nidoca-complex-table-before-page')}"
          icon="navigate_before"
          clickable="true"
          @nidoca-event-icon-clicked="${() => {
      this.previousPage();
    }}"
          ;
        ></nidoca-icon>
        ${repeat(
      this.selectablePages,
      selectablePage => html`
            <nidoca-button
              @nidoca-event-button-clicked="${() => {
        this.page = selectablePage;
        this.search();
      }}"
              text="${selectablePage + 1}"
            ></nidoca-button>
          `,
    )}
        <nidoca-icon
          title="${I18nService.getUniqueInstance().getValue('nidoca-complex-table-next-page')}"
          icon="navigate_next"
          clickable="true"
          @nidoca-event-icon-clicked="${() => {
      this.nextPage();
    }}"
          ;
        ></nidoca-icon>
        <nidoca-icon
          title="${I18nService.getUniqueInstance().getValue('nidoca-complex-table-last-page')}"
          icon="last_page"
          clickable="true"
          @nidoca-event-icon-clicked="${() => {
      this.page = this.totalPages - 1;
      this.search();
    }}"
          ;
        ></nidoca-icon>
      </nidoca-grid-container>
    `;
  }
}
