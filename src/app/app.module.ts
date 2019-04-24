import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { effects } from './store/app.effects';
import { metaReducers, reducers } from './store/app.reducers';

// Modules
import {NgxDhis2MenuModule} from '@hisptz/ngx-dhis2-menu';
import {NgxDhis2DictionaryModule} from '@iapps/ngx-dhis2-dictionary';
import { HttpClientService } from './services/http-client.service';
import { HttpClientModule } from '@angular/common/http';
import { ManifestService } from './services/manifest.service';
import { LoaderPlaceholderComponent } from './shared-components/loader-placeholder/loader-placeholder.component';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoaderPlaceholderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TreeModule.forRoot(),
    NgxDhis2MenuModule,
    NgxDhis2DictionaryModule,
      /**
     * Reducers
     */
    StoreModule.forRoot(reducers, {metaReducers}),

    /**
     * Effects
     */
    EffectsModule.forRoot(effects),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule,

    /**
     * Dev tool, enabled only in development mode
     */
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [HttpClientService, ManifestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
