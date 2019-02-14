import { AppState } from "../app.reducers";
import { createSelector } from '@ngrx/store';
import { IndicatorsState } from './indicators.state';


const indicatorsList = (state: AppState) => state.indicatorsList;

export const getListOfIndicators = createSelector(indicatorsList, (indicatorsListObject: IndicatorsState) => indicatorsListObject);
