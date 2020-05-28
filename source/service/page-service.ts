import {html, TemplateResult} from 'lit-element';
import {RouterService} from '@domoskanonos/frontend-basis';

export class PageService {
  private static instance: PageService;

  private constructor() {}

  static getUniqueInstance() {
    if (!PageService.instance) {
      PageService.instance = new PageService();
    }
    return PageService.instance;
  }

  renderPage(): TemplateResult {
    let currentPage = RouterService.getUniqueInstance().getCurrentPage();
    console.log('render page: '.concat(currentPage));
    switch (currentPage) {
      case '':
      case 'dashboard':
      default:
        return html`
          <page-dashboard></page-dashboard>
        `;
    }
  }
}
