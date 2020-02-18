import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { environment } from "../environments/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { effects } from "./store/app.effects";
import { metaReducers, reducers } from "./store/app.reducers";

// Modules
import { NgxDhis2MenuModule } from "@hisptz/ngx-dhis2-menu";
import { NgxDhis2DictionaryModule } from "@iapps/ngx-dhis2-dictionary";
import { HttpClientModule } from "@angular/common/http";
import { TreeModule } from "angular-tree-component";
import { ExportService } from "./services/export.service";
import { DownloadTemplateComponent } from './pages/home/containers/download-template/download-template.component';
import { BlockWiseTemplateComponent } from './pages/home/containers/block-wise-template/block-wise-template.component';
import { WithGroupsTemplateComponent } from './pages/home/containers/with-groups-template/with-groups-template.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DownloadTemplateComponent, BlockWiseTemplateComponent, WithGroupsTemplateComponent],
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
    StoreModule.forRoot(reducers, { metaReducers }),

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
  providers: [ExportService],
  bootstrap: [AppComponent]
})
export class AppModule {}
