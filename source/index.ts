import messageAppDE from './i18n/message-de.json';
import messageAppEN from './i18n/message-en.json';

import {I18nService, LanguageKey} from '@domoskanonos/frontend-basis';

I18nService.getUniqueInstance().addData(messageAppDE);
I18nService.getUniqueInstance().addData(messageAppEN, LanguageKey.EN);

import './pages/page-dashboard';
import './page-settings';
import './page-register';
import './page-register-ok';
import './page-login';
import './page-logout';
import './page-change-password';
import './page-reset-password';
import './page-terms-of-use';
import './page-default';

import './app';

import './index.css';

export * from '@domoskanonos/nidoca-app';
