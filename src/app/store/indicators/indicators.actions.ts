import {Action} from '@ngrx/store';
import { IndicatorsState } from './indicators.state';

export enum IndicatorsActions {
    LoadIndicators = '[Indicators] Load indicators',
    LoadIndicatorsSuccess = '[Indicators] Load indicators success',
    LoadIndicatorsFail = '[Indicators] Load indicators fail',
    LoadIndicatorsByPages = '[Indicators] Load indicators by pages',
    LoadIndicatorsByPagesSuccess = '[Indicators] Load indicators by pages success',
    LoadIndicatorsByPagesFail = '[Indicators] Load indicators by pages fail',
}

export class LoadIndicatorsAction implements Action {
    readonly type = IndicatorsActions.LoadIndicators;
}

export class LoadIndicatorsSuccessAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsSuccess;

    constructor(public payload: IndicatorsState) {}
}

export class LoadIndicatorsFailAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsFail;

    constructor(public payload: any) {}
}

export class LoadIndicatorsByPagesAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsByPages;
}

export class LoadIndicatorsByPagesSuccessAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsByPagesSuccess;

    constructor(public payload: IndicatorsState) {}
}

export class LoadIndicatorsByPagesFailAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsByPagesFail;

    constructor(public payload: any) {}
}

export type IndicatorsAction = LoadIndicatorsAction 
| LoadIndicatorsSuccessAction 
| LoadIndicatorsFailAction
| LoadIndicatorsByPagesAction
| LoadIndicatorsByPagesSuccessAction
| LoadIndicatorsByPagesFailAction;