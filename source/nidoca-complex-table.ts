import {css, html, property, query, TemplateResult, LitElement} from 'lit-element';
import {guard} from 'lit-html/directives/guard';
import {repeat} from 'lit-html/directives/repeat';

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

export abstract class NidocaComplexTable extends LitElement {
  static styles = css``;

  @property()
  rows: any[][] = [[]];

  protected firstUpdated(): void {
    console.log("load rows");
    this.rows = this.getRows();
  }

  abstract getRows(): any[][];

  render() {
    return html`
      HUHUUHUHUH:
      ${this.rows.length > 0
      ? guard(
        [this.rows],
        () =>
          html`
                ${repeat(
            this.rows,
            (row, rowIndex) => html`
                    <div class="row ${rowIndex % 2 == 0 ? 'odd' : 'even'}">
                      ${guard(
              row,
              () =>
                html`
                            ${repeat(
                  row,
                  (column, index) => html`
                                <span class="column" style="width: auto;">
                                  ${column} ${index}
                                </span>
                              `,
                )}
                          `,
            )}
                    </div>
                  `,
          )}
              `,
      )
      : html`
            <div class="row">
              NO DATA
            </div>
          `}
    `;
  }

}
