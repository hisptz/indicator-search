import {Action} from '@ngrx/store';
/**
 * Created by kelvin on 7/29/17.
 */
export const SET_SELECTED_PERIOD = 'SET_SELECTED_PERIOD';
export const SET_INDICATORS = 'SET_INDICATORS';
export const SET_INDICATOR_GROUPS = 'SET_INDICATOR_GROUPS';
export const SET_SELECTED_INDICATOR = 'SET_SELECTED_INDICATOR';

export class SetIndicatorGroupsAction implements Action {
  type = SET_INDICATOR_GROUPS;
  constructor ( public payload: any ) {}
}

export class SetSelectedPeriodAction implements Action {
  type = SET_SELECTED_PERIOD;
  constructor ( public payload: any ) {}
}

export class SetIndicatorsAction implements Action {
  type = SET_INDICATORS;
  constructor ( public payload: any ) {}
}

export class SetSelectedIndicatorAction implements Action {
  type = SET_SELECTED_INDICATOR;
  constructor ( public payload: any ) {}
}
