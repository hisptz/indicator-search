import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {reducers} from '../store/reducers/reducers';
import {getInitialState} from '../store/application.state';
import {DataStoreEffect} from '../store/effects/dataStore.effect';
import { FirstLoadComponent } from './first-load/first-load.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstLoadComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, {
      initialState: getInitialState
    }),
    EffectsModule.forRoot([DataStoreEffect]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
