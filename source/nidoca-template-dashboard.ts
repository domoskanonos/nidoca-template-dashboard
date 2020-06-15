import {css, html, property, query, TemplateResult, LitElement} from 'lit-element';

import {BasicService} from '@domoskanonos/frontend-basis';
import {BorderProperties, NavigationType, NidocaIcon, VisibleType} from '@domoskanonos/nidoca-core/lib';

export abstract class NidocaDashboardTemplate extends LitElement {
  static styles = css`
    #top {
      position: fixed;
      width: calc(100%);
      height: var(--menubar-height);
      right: 0;
      z-index: 10;
      background-color: var(--app-color-primary-background);
      color: var(--app-color-primary);
    }

    #top.menuClosed {
      width: 100%;
    }

    #bottom {
      position: fixed;
      width: 100px;
      height: calc(50%);
      right: 0;
      bottom: 25%;
      z-index: 10;
      background-color: var(--app-color-primary-background);
      color: var(--app-color-primary);
    }

    #main {
      padding-top: var(--menubar-height);
      min-height: 100%;
    }
    #main.menuClosed {
      margin-left: 0;
    }

    #main.body-opacity {
      opacity: 0.5;
      transition: all 0.35s ease;
    }

    #main.menuClosed {
      margin-left: 0;
      opacity: 1;
      background: #fff;
      transition: all 0.35s ease;
    }

    #main.dismissible-main {
      opacity: 1;
      transition: all 0.35s ease;
    }

    #main.menuClosed {
      margin-left: 0;
      opacity: 1;
      background: #fff;
      transition: all 0.35s ease;
    }

    .permanent-main {
      width: calc(100vw - var(--menu-size)) !important;
      position: relative;
      float: right;
      transition: all 0.35s ease;
    }

    .dismissible-main {
      width: calc(100vw - var(--menu-size)) !important;
      position: relative;
      float: right;
      transition: all 0.35s ease;
    }

    #main {
      width: 100%;
    }

    @media screen and (min-width: 521px) {
      #main {
        transition: margin-left 0.25s linear;
        margin-left: var(--menu-size);
      }
    }

    @media (orientation: portrait) {
      #bottom {
        position: fixed;
        width: calc(100%);
        height: var(--menubar-height);
        right: 0;
        bottom: 0;
        z-index: 10;
      }
      #bottom.menuClosed {
        width: 100%;
      }
    }
  `;

  @property()
  menuSwitchIcon = 'menu';

  @property()
  menuCss: string = 'menuClosed basicShadow';

  @property()
  navigationClosed: boolean = true;

  @property()
  navigationType: string = NavigationType.DISMISSIBLE;

  @property()
  showTopBar: boolean = true;

  @property()
  showBottomBar: boolean = true;

  @query('#top')
  private topElement: HTMLElement | undefined;
  @query('#left')
  private leftElement: HTMLElement | undefined;
  @query('#main')
  private mainElement: HTMLElement | undefined;

  render() {
    return html`
      <nidoca-navigation .closed="${this.navigationClosed}" navigationType="${this.navigationType}">
      
        ${this.getLeftNavigationContent()}
      </nidoca-navigation>

      <nidoca-visible visibleType="${this.showTopBar ? VisibleType.NORMAL : VisibleType.HIDE}">
        <top id="top" class="${this.menuCss}" @nidoca-event-icon-clicked="${this.menuItemClicked}">
          <nidoca-border ..borderProperties="${[BorderProperties.BOTTOM]}">
            ${this.getTopContent()}
          </nidoca-border>
        </top>
      </nidoca-visible>

      <div id="main" class="${this.menuCss} body-opacity">
        ${this.getMainComponent()}
      </div>
      <nidoca-visible visibleType="${this.showBottomBar ? VisibleType.NORMAL : VisibleType.HIDE}">
        <div id="bottom">
          ${this.getBottomContent()}
        </div></nidoca-visible
      >
    `;
  }

  abstract getMainComponent(): TemplateResult;

  abstract getLeftNavigationContent(): TemplateResult;

  abstract getTopContent(): TemplateResult;

  abstract getBottomContent(): TemplateResult;

  menuItemClicked(event: CustomEvent) {
    let id: NidocaIcon = event.detail;
    if (BasicService.getUniqueInstance().isEqual(id.icon, this.menuSwitchIcon)) {
      console.log('menuItemClicked...');
      this.toogleMenu();
    }
  }

  private toogleMenu(): void {
    if (this.menuCss.indexOf('menuClosed') == -1) {
      this.menuCss = 'menuClosed basicShadow';
      this.navigationClosed = true;
    } else if (this.navigationType == NavigationType.PERMANENT) {
      this.menuCss = 'permanent-top permanent-main';
      this.navigationClosed = false;
    } else if (this.navigationType == NavigationType.DISMISSIBLE) {
      this.menuCss = 'dismissible-main';
      this.navigationClosed = false;
    } else {
      this.menuCss = 'basicShadow';
      this.navigationClosed = false;
    }
  }
}
