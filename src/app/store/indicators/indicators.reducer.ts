import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';

import { IndicatorsState, AllIndicatorsState, IndicatorPropertiesState, IndicatorGroupsState } from './indicators.state';
import { IndicatorsAction, IndicatorsActions} from './indicators.actions';



export interface State extends EntityState<AllIndicatorsState> {
    indicators: any;
    progressLoadingValue: number;
    dataSets: Array<any>;
}

export const adapter: EntityAdapter<AllIndicatorsState> = createEntityAdapter<AllIndicatorsState>();

export const INITIAL_STATE_LOADED_INDICATORS: State = adapter.getInitialState({
    indicators: null,
    progressLoadingValue: 0,
    dataSets: []
})


export function indicatorsListReducer(state: IndicatorsState = null, action: IndicatorsAction) {
    switch (action.type) {
        case IndicatorsActions.LoadIndicatorsSuccess:
            return {...action.payload}
        default:
            return state;
    }
}

export function allIndicatorsRedcuer(state: AllIndicatorsState = INITIAL_STATE_LOADED_INDICATORS, action: IndicatorsAction) {
    switch (action.type) {
        case IndicatorsActions.LoadIndicatorsByPagesSuccess:
            return {
                ...state,
                indicators: action.payload
            }
        case IndicatorsActions.ProgressLoadingIndicators:
            return {...state,
                progressLoadingValue: action.payload
            }
        case IndicatorsActions.LoadIndicatorDataSetByDataElementIdSuccess:
            return {
                ...state,
                dataSets: action.payload
            }
        default:
            return state;
    }
}

export function indicatorGroupsReducer(state: IndicatorGroupsState = null, action: IndicatorsAction) {
    switch (action.type) {
        case IndicatorsActions.LoadIndicatorGroupsSuccess:
            return {
                ...action.payload
            }
        default:
            return state;
    }
}

