import { BrowserModule } from '@angular/platform-browser';
import {Directive, NgModule} from '@angular/core';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import {ClickOutsideDirective} from './directives/click-outside.directive';

import { NgxPaginationModule } from 'ngx-pagination';
import { TreeModule } from 'angular-tree-component';
import { DndModule } from 'ng2-dnd';
import { Ng2HighchartsModule } from 'ng2-highcharts';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {reducers} from './store/reducers/reducers';
import {getInitialState} from './store/application.state';
import {DataStoreEffect} from './store/effects/dataStore.effect';

import {Constants} from './services/costants';
import {VisualizerService} from './services/visualizer.service';
import {OrgUnitService} from './services/org-unit.service';
import { FilterGroupsPipe } from './pipes/filter-groups.pipe';
import { HttpClientService } from './services/http-client.service';
import { IndicatorGroupService } from './services/indicator-group.service';
import { DetailsComponent } from './details/details.component';
import { DataComponent } from './details/data/data.component';
import { TrendComponent } from './details/trend/trend.component';
import { DataQualityComponent } from './details/data-quality/data-quality.component';
import { TableTemplateComponent } from './shared-components/table-template/table-template.component';
import { PeriodFilterComponent } from './shared-components/period-filter/period-filter.component';
import { MetadataDictionaryComponent } from './details/metadata-dictionary/metadata-dictionary.component';
import { FirstLoadComponent } from './first-load/first-load.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { FilterLevelPipe } from './pipes/filter-level.pipe';
import {NgxDhis2MenuModule} from '@hisptz/ngx-dhis2-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    FirstLoadComponent,
    IndicatorComponent,
    FilterByNamePipe,
    MetadataDictionaryComponent,
    PeriodFilterComponent,
    ClickOutsideDirective,
    FilterLevelPipe,
    DetailsComponent,
    DataComponent,
    TrendComponent,
    DataQualityComponent,
    TableTemplateComponent,
    FilterGroupsPipe,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgxDhis2MenuModule,
    DndModule.forRoot(),
    StoreModule.forRoot(reducers, {
      initialState: getInitialState
    }),
    EffectsModule.forRoot([DataStoreEffect]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [IndicatorGroupService, HttpClientService, Constants, VisualizerService, OrgUnitService],
  bootstrap: [AppComponent]
})
export class AppModule { }
