import { StoreData } from '../store-data';
import * as store_actions from '../actions/store.data.action';

import * as _ from 'lodash';


export function storeData(state: StoreData, action: any): StoreData {
    switch (action.type)  {
      case store_actions.SET_SELECTED_PERIOD:
        const currentpe = _.cloneDeep(state);
        currentpe.currentperiod = action.payload;
        return currentpe;

      default:
        return state;
    }
}















