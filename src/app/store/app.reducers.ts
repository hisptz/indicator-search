import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "../../environments/environment";
import { storeFreeze } from "ngrx-store-freeze";
import { RouterReducerState } from "@ngrx/router-store";
import * as RouterReducer from "@ngrx/router-store";
import { CurrentUserState } from "./current-user/current-user.state";
import { currentUserReducer } from "./current-user/current-user.reducer";
import { MetadataExpressionDefinitionState } from "./metadata/metadata.states";
import { metadataExpressionDefnReducer } from "./metadata/metadata.reducer";

export interface AppState {
  route: RouterReducerState;
  currentUser: CurrentUserState;
  metadataExpressionDefinitions: MetadataExpressionDefinitionState;
}

export const reducers: ActionReducerMap<AppState> = {
  route: RouterReducer.routerReducer,
  currentUser: currentUserReducer,
  metadataExpressionDefinitions: metadataExpressionDefnReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];
