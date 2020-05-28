import {customElement, TemplateResult} from 'lit-element';
import {
  I18nService,
  WebApiService,
  HttpClientService,
  WebApiServicePermissionRequest,
  HttpClientCorsMode,
  RouterService,
  SecureService,
} from '@domoskanonos/frontend-basis';
import {NidocaAbstractApp} from '@domoskanonos/nidoca-core';
import {NidocaI18NSelector} from '@domoskanonos/nidoca-app';

import {HttpResponseCodeInterceptor, HttpResponseCode} from '@domoskanonos/frontend-basis';
import {PageService} from './service/page-service';

@customElement('app-root')
export class App extends NidocaAbstractApp {
  getAppTitle(): string {
    return I18nService.getUniqueInstance().getValue('title');
  }

  protected registerEventListener(): void {
    super.registerEventListener();
    window.addEventListener('nidoca-event-i18n-selector-change-language', event => {
      if (event instanceof CustomEvent) {
        let customEvent: CustomEvent = event;
        let language: string = customEvent.detail;
        console.log('language changed %s, refresh gui...', language);
        this.requestUpdate().then(value => {
          console.log('update reqeuested:' + value);
        });
      }
    });
  }

  async preRender(): Promise<void> {
    HttpClientService.getUniqueInstance().defaultRequest.cors = HttpClientCorsMode.CORS;

    let httpResponseCodeInterceptor: HttpResponseCodeInterceptor = new (class extends HttpResponseCodeInterceptor {
      getCode(): HttpResponseCode {
        return HttpResponseCode.UNAUTHORIZED;
      }

      run(): void {
        SecureService.getUniqueInstance().setAuthenticated(false);
        RouterService.getUniqueInstance().navigate('login');
      }
    })();
    HttpClientService.getUniqueInstance().addHttpResponseCodeInterceptor(httpResponseCodeInterceptor);

    let config = HttpClientService.getUniqueInstance().config;
    //config.baseURL = 'http://85.235.67.10:8099';
    config.baseURL = 'http://localhost:8099';

    WebApiService.getUniqueInstance()
      .requestPermission(WebApiServicePermissionRequest.NOTIFICATION)
      .then((granted: boolean) => {
        console.log('permission granted ? ' + granted);
      });

    return super.preRender();
  }

  renderPage(): TemplateResult {
    return PageService.getUniqueInstance().renderPage();
  }
}
