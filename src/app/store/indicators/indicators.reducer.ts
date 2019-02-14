import { IndicatorsState } from './indicators.state';
import { IndicatorsAction, IndicatorsActions} from './indicators.actions'


export function indicatorsListReducer(state: IndicatorsState = null, action: IndicatorsAction) {
    switch (action.type) {
        case IndicatorsActions.LoadIndicatorsSuccess:
            return {...action.payload}
        default:
            return state;
    }
}