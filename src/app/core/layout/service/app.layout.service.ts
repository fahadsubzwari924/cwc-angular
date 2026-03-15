import { Injectable } from '@angular/core';
import { signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  config: WritableSignal<AppConfig> = signal({
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14,
  });

  state: WritableSignal<LayoutState> = signal({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  });

  private configUpdate = new Subject<AppConfig>();
  private overlayOpen = new Subject<any>();

  configUpdate$ = this.configUpdate.asObservable();
  overlayOpen$ = this.overlayOpen.asObservable();

  onMenuToggle() {
    const currentState = this.state();
    const currentConfig = this.config();

    if (this.isOverlay()) {
      this.state.update((state) => ({
        ...state,
        overlayMenuActive: !state.overlayMenuActive,
      }));
      if (!currentState.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.update((state) => ({
        ...state,
        staticMenuDesktopInactive: !state.staticMenuDesktopInactive,
      }));
    } else {
      this.state.update((state) => ({
        ...state,
        staticMenuMobileActive: !state.staticMenuMobileActive,
      }));

      if (!currentState.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  showProfileSidebar() {
    this.state.update((state) => ({
      ...state,
      profileSidebarVisible: !state.profileSidebarVisible,
    }));

    if (!this.state().profileSidebarVisible) {
      this.overlayOpen.next(null);
    }
  }

  showConfigSidebar() {
    this.state.update((state) => ({
      ...state,
      configSidebarVisible: true,
    }));
  }

  isOverlay() {
    return this.config().menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this.configUpdate.next(this.config());
  }
}
