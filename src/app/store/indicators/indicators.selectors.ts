import { AppState } from "../app.reducers";
import { createSelector } from '@ngrx/store';
import { IndicatorsState } from './indicators.state';


const indicatorsList = (state: AppState) => state.indicatorsList;

const allIndicators = (state: AppState) => state.allIndicators.indicators;

const allIndicatorWithDetails = (state: AppState) => state.allIndicators;

const progressLoaderInfo = (state: AppState) => state.allIndicators.progressLoadingValue;

const indicatorGroups = (state: AppState) => state.indicatorGroups;

const dataSetInfoByDataElementId = (state: AppState) => state.allIndicators.dataSets;

const dataSetsOfIndicators = (state: AppState) => state.allIndicators.dataSetsDefinitions;

export const getListOfIndicators = createSelector(indicatorsList, (indicatorsListObject: IndicatorsState) => indicatorsListObject);

export const getallIndicators = createSelector(allIndicators, (allIndicatorsObject: any) => allIndicatorsObject);

export const getProgressLoaderInfo = createSelector(progressLoaderInfo, (progressLoaderInfoObj: any) => progressLoaderInfoObj);

export const getIndicatorGroups = createSelector(indicatorGroups, (indicatorGroupsObj: any) => indicatorGroupsObj);

export const getAllIndicatorWithDetails = createSelector(allIndicatorWithDetails, (allIndicatorWithDetailsObj: any) => allIndicatorWithDetailsObj);

export const getDataSetsInfoByDataElementId = createSelector(dataSetInfoByDataElementId, (dataSetInfoByDataElementIdObj: any) => dataSetInfoByDataElementIdObj);

export const getDataSetsOfIndicators = createSelector(dataSetsOfIndicators, (dataSetsOfIndicatorsObj: any) => dataSetsOfIndicatorsObj)
