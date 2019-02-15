import {Action} from '@ngrx/store';
import { IndicatorsState, AllIndicatorsState } from './indicators.state';

export enum IndicatorsActions {
    LoadIndicators = '[Indicators] Load indicators',
    LoadIndicatorsSuccess = '[Indicators] Load indicators success',
    LoadIndicatorsFail = '[Indicators] Load indicators fail',
    LoadIndicatorsByPages = '[Indicators] Load indicators by pages',
    LoadIndicatorsByPagesSuccess = '[Indicators] Load indicators by pages success',
    LoadIndicatorsByPagesFail = '[Indicators] Load indicators by pages fail',
    ProgressLoadingIndicators = '[Progress bar] progress bar for loaded indicators'
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

    constructor(public payload: any) {}
}

export class LoadIndicatorsByPagesSuccessAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsByPagesSuccess;

    constructor(public payload: any) {}
}

export class LoadIndicatorsByPagesFailAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsByPagesFail;

    constructor(public payload: any) {}
}

export class ProgressBarStatusAction implements Action {
    readonly type = IndicatorsActions.ProgressLoadingIndicators;

    constructor (public payload: number) {}
}

export type IndicatorsAction = LoadIndicatorsAction 
| LoadIndicatorsSuccessAction 
| LoadIndicatorsFailAction
| LoadIndicatorsByPagesAction
| LoadIndicatorsByPagesSuccessAction
| LoadIndicatorsByPagesFailAction
| ProgressBarStatusAction;