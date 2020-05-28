import {html, TemplateResult} from 'lit-element';
import {RouterService, I18nService} from '@domoskanonos/frontend-basis';

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
      case 'taxattachment_edit':
        return html`
          <taxattachment-edit-page></taxattachment-edit-page>
        `;
      case 'taxattachment_search_list':
        return html`
          <taxattachment-search-list-page></taxattachment-search-list-page>
        `;
      case 'note_edit':
        return html`
          <note-edit-page></note-edit-page>
        `;
      case 'note_search_list':
        return html`
          <note-search-list-page></note-search-list-page>
        `;
      case 'tax_edit':
        return html`
          <tax-edit-page></tax-edit-page>
        `;
      case 'tax_search_list':
        return html`
          <tax-search-list-page></tax-search-list-page>
        `;
      case 'bankaccount_edit':
        return html`
          <bankaccount-edit-page></bankaccount-edit-page>
        `;
      case 'bankaccount_search_list':
        return html`
          <bankaccount-search-list-page></bankaccount-search-list-page>
        `;
      case 'passwordstore_edit':
        return html`
          <passwordstore-edit-page></passwordstore-edit-page>
        `;
      case 'passwordstore_search_list':
        return html`
          <passwordstore-search-list-page></passwordstore-search-list-page>
        `;
      case 'websiteregistration_edit':
        return html`
          <websiteregistration-edit-page></websiteregistration-edit-page>
        `;
      case 'websiteregistration_search_list':
        return html`
          <websiteregistration-search-list-page></websiteregistration-search-list-page>
        `;
      case 'shoppinglist_edit':
        return html`
          <shoppinglist-edit-page></shoppinglist-edit-page>
        `;
      case 'shoppinglist_search_list':
        return html`
          <shoppinglist-search-list-page></shoppinglist-search-list-page>
        `;
      case 'contact_edit':
        return html`
          <contact-edit-page></contact-edit-page>
        `;
      case 'contact_search_list':
        return html`
          <contact-search-list-page></contact-search-list-page>
        `;
      case 'creditcardwebsiteregistrationid_edit':
        return html`
          <creditcardwebsiteregistrationid-edit-page></creditcardwebsiteregistrationid-edit-page>
        `;
      case 'creditcardwebsiteregistrationid_search_list':
        return html`
          <creditcardwebsiteregistrationid-search-list-page></creditcardwebsiteregistrationid-search-list-page>
        `;
      case 'creditcard_edit':
        return html`
          <creditcard-edit-page></creditcard-edit-page>
        `;
      case 'creditcard_search_list':
        return html`
          <creditcard-search-list-page></creditcard-search-list-page>
        `;
      case 'contract_edit':
        return html`
          <contract-edit-page></contract-edit-page>
        `;
      case 'contract_search_list':
        return html`
          <contract-search-list-page></contract-search-list-page>
        `;
      case 'settings':
        return html`
          <page-settings navigationTitle="${I18nService.getUniqueInstance().getValue('settings')}"></page-settings>
        `;
      case 'register':
        return html`
          <page-register navigationTitle="${I18nService.getUniqueInstance().getValue('register')}"></page-register>
        `;
      case 'register_ok':
        return html`
          <page-register-ok
            navigationTitle="${I18nService.getUniqueInstance().getValue('register_ok')}"
          ></page-register-ok>
        `;
      case 'login':
        return html`
          <page-login navigationTitle="${I18nService.getUniqueInstance().getValue('login')}"></page-login>
        `;
      case 'logout':
        return html`
          <page-logout navigationTitle="${I18nService.getUniqueInstance().getValue('logout')}"></page-logout>
        `;
      case 'change_password':
        return html`
          <page-change-password
            navigationTitle="${I18nService.getUniqueInstance().getValue('change_password')}"
          ></page-change-password>
        `;
      case 'reset_password':
        return html`
          <page-reset-password
            navigationTitle="${I18nService.getUniqueInstance().getValue('reset_password')}"
          ></page-reset-password>
        `;

      case 'terms_of_use':
        return html`
          <page-terms-of-use
            navigationTitle="${I18nService.getUniqueInstance().getValue('terms_of_use')}"
          ></page-terms-of-use>
        `;
      case '':
      case 'dashboard':
      default:
        return html`
          <page-dashboard></page-dashboard>
        `;
    }
  }
}
