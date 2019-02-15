import {Injectable} from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as indicators from './indicators.actions';
import { Observable, of, forkJoin } from 'rxjs';
import * as _ from 'lodash';

import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { HttpClientService } from 'src/app/services/http-client.service';
import { IndicatorsState } from './indicators.state';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { IndicatorSearchService } from 'src/app/services/indicator-search.service';
import { ProgressBarStatusAction } from './indicators.actions';


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

    @Effect({dispatch: false})
    indicatorsListSuccess$: Observable<any> = this.actions$
    .pipe(
      ofType<indicators.IndicatorsAction>(indicators.IndicatorsActions.LoadIndicatorsSuccess),
      tap((action: any) => {
        console.log('indicators action ', action.payload);
        this.router.navigate(['/home']);
        // load indicators by pages
        this.store.dispatch(new indicators.LoadIndicatorsByPagesAction(action.payload['pager']));
      })
    )

    // @Effect()
    // indicatorsLoadByPages$ = this.actions$
    // .pipe(ofType<indicators.LoadIndicatorsAction>(indicators.IndicatorsActions.LoadIndicatorsByPages),
    //   switchMap((action: any) => this._loadAllIndicators(action.payload).pipe(
    //     map((indicatorsObj: any) => new indicators.LoadIndicatorsByPagesSuccessAction(indicatorsObj)),
    //     catchError((error) => of(new indicators.LoadIndicatorsByPagesFailAction(error)))
    //   ))
    // )

    @Effect()
    allIndicators$ = this.actions$
    .pipe(ofType<indicators.LoadIndicatorsAction>(indicators.IndicatorsActions.LoadIndicatorsByPages),
    map((action: any) => {
      let indicatorsArr: any[] = [];
      this.indicatorService._loadAllIndicators(action.payload).subscribe((allIndicators) => {
        indicatorsArr = [...indicatorsArr, ...allIndicators]
        this.store.dispatch(new indicators.LoadIndicatorsByPagesSuccessAction(indicatorsArr));
      })
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
