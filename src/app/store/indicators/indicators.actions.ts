import {Action} from '@ngrx/store';
import { IndicatorsState, AllIndicatorsState, IndicatorGroupsState } from './indicators.state';

export enum IndicatorsActions {
    LoadIndicators = '[Indicators] Load indicators',
    LoadIndicatorsSuccess = '[Indicators] Load indicators success',
    LoadIndicatorsFail = '[Indicators] Load indicators fail',
    LoadIndicatorsByPages = '[Indicators] Load indicators by pages',
    LoadIndicatorsByPagesSuccess = '[Indicators] Load indicators by pages success',
    LoadIndicatorsByPagesFail = '[Indicators] Load indicators by pages fail',
    ProgressLoadingIndicators = '[Progress bar] progress bar for loaded indicators',
    LoadIndicatorProperties = '[Indicator properties] Load indicator properties',
    LoadIndicatorPropertiesFail = '[Indicator properties] Load indicator properties fail',
    LoadIndicatorPropertiesSuccess = '[Indicator properties] Load indicator properties success',
    LoadIndicatorGroups = '[Indicator Groups] Load indicator Groups',
    LoadIndicatorGroupsSuccess = '[Indicator Groups] Load indicator Groups success',
    LoadIndicatorGroupsFail = '[Indicator Groups] Load indicator Groups fail',
    LoadIndicatorDataSetByDataElementId = '[Indicator dataset] Load indicator dataset by data element',
    LoadIndicatorDataSetByDataElementIdSuccess = '[Indicator dataset] Load indicator dataset by data element success',
    LoadIndicatorDataSetByDataElementIdFail = '[Indicator dataset] Load indicator dataset by data element fail',
    LoadIndicatorDataSetByDataElementIds = '[Indicator datasets list] Load indicator dataset by data element',
    LoadIndicatorDataSetByDataElementIdsSuccess = '[Indicator datasets list] Load indicator dataset by data element success',
    LoadIndicatorDataSetByDataElementIdsFail = '[Indicator datasets list] Load indicator dataset by data element fail',

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

export class LoadIndicatorPropertiesAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorProperties;
    constructor(public payload: any) {}
}

export class LoadIndicatorPropertiesSuccessAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorPropertiesSuccess;
    constructor(public payload: any) {}
}

export class LoadIndicatorPropertiesFailAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorPropertiesFail;
    constructor(public payload: any) {}
}

export class LoadIndicatorGroupsAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorGroups;
}

export class LoadIndicatorGroupsSuccessAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorGroupsSuccess;

    constructor(public payload: IndicatorGroupsState) {}
}

export class LoadIndicatorGroupsFailAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorsByPagesFail;

    constructor(public payload: any) {}
}


export class LoadIndicatorDataSetByDataElementIdAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorDataSetByDataElementId;

    constructor(public payload: any) {}
}

export class LoadIndicatorDataSetByDataElementIdSuccessAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorDataSetByDataElementIdSuccess;

    constructor(public payload: any) {}
}

export class LoadIndicatorDataSetByDataElementIdFailAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorDataSetByDataElementIdFail;

    constructor(public payload: any) {}
}


export class LoadIndicatorDataSetByDataElementIdsAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorDataSetByDataElementIds;

    constructor(public payload: any) {}
}

export class LoadIndicatorDataSetByDataElementIdsSuccessAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorDataSetByDataElementIdsSuccess;

    constructor(public payload: any) {}
}

export class LoadIndicatorDataSetByDataElementIdsFailAction implements Action {
    readonly type = IndicatorsActions.LoadIndicatorDataSetByDataElementIdsFail;

    constructor(public payload: any) {}
}


export type IndicatorsAction = LoadIndicatorsAction 
| LoadIndicatorsSuccessAction 
| LoadIndicatorsFailAction
| LoadIndicatorsByPagesAction
| LoadIndicatorsByPagesSuccessAction
| LoadIndicatorsByPagesFailAction
| ProgressBarStatusAction
| LoadIndicatorPropertiesAction
| LoadIndicatorPropertiesSuccessAction
| LoadIndicatorPropertiesFailAction
| LoadIndicatorGroupsAction
| LoadIndicatorGroupsSuccessAction
| LoadIndicatorGroupsFailAction
| LoadIndicatorDataSetByDataElementIdAction
| LoadIndicatorDataSetByDataElementIdSuccessAction
| LoadIndicatorDataSetByDataElementIdFailAction
| LoadIndicatorDataSetByDataElementIdsAction
| LoadIndicatorDataSetByDataElementIdsSuccessAction
| LoadIndicatorDataSetByDataElementIdsFailAction;