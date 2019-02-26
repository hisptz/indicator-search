import {Injectable} from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as indicators from './indicators.actions';
import { Observable, of, forkJoin } from 'rxjs';
import * as _ from 'lodash';

import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { HttpClientService } from 'src/app/services/http-client.service';
import { IndicatorsState, IndicatorGroupsState } from './indicators.state';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { IndicatorSearchService } from 'src/app/services/indicator-search.service';
import { ProgressBarStatusAction } from './indicators.actions';
import { getAllIndicatorWithDetails } from './indicators.selectors';


@Injectable()
export class IndicatorsEffects {
    @Effect()
    indicatorsList$: Observable<any> = this.actions$
    .pipe(ofType<indicators.IndicatorsAction>(indicators.IndicatorsActions.LoadIndicators),
        switchMap(() => this.httpClient.get('indicators.json').pipe(
          map((indicatorsListObject: IndicatorsState) =>
            new indicators.LoadIndicatorsSuccessAction(indicatorsListObject)),
          catchError((error) => of(new indicators.LoadIndicatorsFailAction(error)))
        ))
    );

    @Effect()
    indicatorGroups$: Observable<any> = this.actions$
    .pipe(ofType<indicators.IndicatorsAction>(indicators.IndicatorsActions.LoadIndicatorGroups),
        switchMap(() => this.httpClient.get('indicatorGroups.json?fields=id,name,description,indicators[id]&paging=false').pipe(
          map((indicatorGroupsObject: IndicatorGroupsState) =>
            new indicators.LoadIndicatorGroupsSuccessAction(indicatorGroupsObject)),
          catchError((error) => of(new indicators.LoadIndicatorGroupsFailAction(error)))
        ))
    );

    @Effect({dispatch: false})
    indicatorsListSuccess$: Observable<any> = this.actions$
    .pipe(
      ofType<indicators.IndicatorsAction>(indicators.IndicatorsActions.LoadIndicatorsSuccess),
      tap((action: any) => {
        let navigateTo = '';
        if (this.router.url !== "/") {
          navigateTo = this.router.url;
        } else {
          navigateTo = '/home';
        }
        this.router.navigate([navigateTo]);
        let indicatorsArr: any[] = [];
        this.indicatorService._loadAllIndicators(action.payload['pager']).subscribe((allIndicators) => {
          indicatorsArr = [...indicatorsArr, ...allIndicators]
          this.store.dispatch(new indicators.LoadIndicatorsByPagesSuccessAction(indicatorsArr));

          // let indicatorsWithProperties: any[] = [];
          // this.indicatorService._indicatorProperties(allIndicators['indicators']).subscribe((indicator) => {
          //   indicatorsWithProperties = [...indicatorsWithProperties, ...indicator];
          //   console.log(indicatorsWithProperties);
          //   this.store.dispatch(new indicators.LoadIndicatorPropertiesSuccessAction(indicatorsWithProperties));
          // });
        });
      })
    )
    

    @Effect()
    indicatorDataSetByDataElementId$: Observable<any> = this.actions$
    .pipe(ofType<indicators.IndicatorsAction>(indicators.IndicatorsActions.LoadIndicatorDataSetByDataElementId),
        switchMap((action: any) => this.httpClient.get('dataElements/' + action.payload+ '.json?fields=id,name,dataSetElements[dataSet[id,name,periodType,timelyDays,formType]]').pipe(
          map((dataSetElementsObj: any) =>
            new indicators.LoadIndicatorDataSetByDataElementIdSuccessAction(dataSetElementsObj)),
          catchError((error) => of(new indicators.LoadIndicatorDataSetByDataElementIdFailAction(error)))
        ))
    );

    @Effect({dispatch: false})
    indicatorsSourcesByDataElements$: Observable<any> = this.actions$
    .pipe(
      ofType<indicators.IndicatorsAction>(indicators.IndicatorsActions.LoadIndicatorDataSetByDataElementIds),
      tap((action: any) => {
        console.log('indicators action', action.payload);
        let dataSetElementsArray: any[] = [];
        this.indicatorService._loadIndicatorsSourcesByDataElements(action.payload).subscribe((dataSetElements) => {
          dataSetElementsArray = [...dataSetElementsArray, ...dataSetElements];
          console.log('dataSetElementsArray', dataSetElementsArray)
          this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdsSuccessAction(dataSetElementsArray));
        });
      })
    )

    constructor (private actions$: Actions, 
      private httpClient: HttpClientService, 
      private router: Router, 
      private store: Store<AppState>,
      private indicatorService: IndicatorSearchService) {}

    _loadAllIndicators(pagerDefinitions) {
      return new Observable(observer => {
        // create array
        let pagesIndexes = [];
        let progressBarValue = 0;
        for (var count =1; count < pagerDefinitions.pageCount; count++) {
          pagesIndexes.push(count);
        }
        if (pagesIndexes.length > 0) {
          forkJoin(
            _.map((pagesIndexes), (pageNumber: number) => 
              this.indicatorService.loadIndicatorsByPage(pageNumber)
            )
          ).subscribe((indicatorsLoaded: any) => {
            if (indicatorsLoaded) {
              console.log(indicatorsLoaded)
              progressBarValue += 20
              this.store.dispatch(new ProgressBarStatusAction(progressBarValue));
              observer.next(
                ...indicatorsLoaded
              )
            }
          })
        }
      })
    }
}
