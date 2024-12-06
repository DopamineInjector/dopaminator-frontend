import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  provideRouter,
  RouteReuseStrategy,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideAnimationsAsync('noop'),
    {
      provide: RouteReuseStrategy,
      useValue: {
        shouldDetach: (route: ActivatedRouteSnapshot) => false,
        store: (
          route: ActivatedRouteSnapshot,
          handle: DetachedRouteHandle | null
        ) => {},
        shouldAttach: (route: ActivatedRouteSnapshot) => false,
        retrieve: (route: ActivatedRouteSnapshot) => null,
        shouldReuseRoute: (
          future: ActivatedRouteSnapshot,
          current: ActivatedRouteSnapshot
        ) => false,
      },
    },
  ],
};
