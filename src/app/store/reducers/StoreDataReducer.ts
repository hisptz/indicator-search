import { StoreData } from '../store-data';
import * as store_actions from '../actions/store.data.action';

import * as _ from 'lodash';


export function storeData(state: StoreData, action: any): StoreData {
    switch (action.type)  {
      case store_actions.SET_SELECTED_PERIOD: {
        const newState = _.cloneDeep(state);
        newState.currentperiod = action.payload;
        return newState;
      }

      case store_actions.SET_SELECTED_INDICATOR: {
        const newState = _.cloneDeep( state );
        newState.currentSelectedIndicator = action.payload;
        return newState;
      }

      default:
        return state;
    }
}















