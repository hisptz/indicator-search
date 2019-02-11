import {ApplicationState} from './application.state';
import {createSelector} from '@ngrx/store';

import * as _ from 'lodash';

/**
 * Created by kelvin on 9/9/17.
 */
export const getStoreData = (state: ApplicationState) => state.storeData;

export const getIndicators = createSelector(getStoreData, (datastate) => {
  return datastate.indicators;
});

export const getCurrentSelectedIndicator = createSelector(getStoreData, (datastate) => {
  return datastate.currentSelectedIndicator;
});

