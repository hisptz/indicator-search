import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { TreeModule } from 'angular-tree-component';
import { DndModule } from 'ng2-dnd';
import { Ng2HighchartsModule } from 'ng2-highcharts';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import {reducers} from './store/reducers/reducers';
import {getInitialState} from './store/application.state';
import {DataStoreEffect} from './store/effects/dataStore.effect';
import { FirstLoadComponent } from './first-load/first-load.component';
import {MenuModule} from './components/menu/menu.module';
import {IndicatorGroupService} from './services/indicator-group.service';
import { IndicatorComponent } from './indicator/indicator.component';
import {FilterByNamePipe} from './pipes/filter-by-name.pipe';
import {MetadataDictionaryComponent} from './details/metadata-dictionary/metadata-dictionary.component';
import {HttpClientService} from './services/http-client.service';
import {PeriodFilterComponent} from './components/period-filter/period-filter.component';
import {OrgUnitFilterComponent} from './components/org-unit-filter/org-unit-filter.component';
import {MultiselectComponent} from './components/org-unit-filter/multiselect/multiselect.component';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FilterLevelPipe} from './pipes/filter-level.pipe';
import {Constants} from './services/costants';
import { DetailsComponent } from './details/details.component';
import { DataComponent } from './details/data/data.component';
import { TrendComponent } from './details/trend/trend.component';
import { DataQualityComponent } from './details/data-quality/data-quality.component';
import {VisualizerService} from './services/visualizer.service';
import {OrgUnitService} from './services/org-unit.service';
import {TableTemplateComponent} from './components/table-template/table-template.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstLoadComponent,
    IndicatorComponent,
    FilterByNamePipe,
    MetadataDictionaryComponent,
    PeriodFilterComponent,
    OrgUnitFilterComponent,
    MultiselectComponent,
    ClickOutsideDirective,
    FilterLevelPipe,
    DetailsComponent,
    DataComponent,
    TrendComponent,
    DataQualityComponent,
    TableTemplateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    Ng2HighchartsModule,
    NgxPaginationModule,
    MenuModule,
    TreeModule,
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
