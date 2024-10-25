import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {ReactiveFormsModule, FormsModule, FormGroup} from '@angular/forms';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { DataDirective } from './data.directive';



export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(DataDirective),
    importProvidersFrom(ReactiveFormsModule),
    importProvidersFrom(FormsModule),
    importProvidersFrom(FormGroup)
  ]
};
