import {Injectable} from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as indicators from './indicators.actions';
import { Observable, of } from 'rxjs';

import {catchError, map, switchMap} from 'rxjs/operators';
import { HttpClientService } from 'src/app/services/http-client.service';
import { IndicatorsState } from './indicators.state';


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

    constructor (private actions$: Actions, private httpClient: HttpClientService) {}
}
