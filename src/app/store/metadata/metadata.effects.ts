import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { Observable, from } from "rxjs";
import {
  LoadMetadataDefinitionsAction,
  MetadataAction,
  MetadataActionsTypes,
  AddLoadedMetadataDefinitionAction
} from "./metadata.actions";
import { mergeMap, switchMap, map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../app.reducers";
import { MetadataInfoService } from "src/app/services/metadata-info.service";
import { formatMetadataExpression } from "src/app/helpers/metadata-processing.helpers";

@Injectable()
export class MetadataEffects {
  @Effect({ dispatch: false })
  metadataExpressionDefinitions$: Observable<any> = this.actions$.pipe(
    ofType(MetadataActionsTypes.LoadMetadataDefinitions),
    switchMap(action => {
      return from(action["indIdWithExpression"]).pipe(
        mergeMap(parameter =>
          this.metadataService
            .loadMetadataInfo(parameter)
            .pipe(
              map(response =>
                this.store.dispatch(
                  new AddLoadedMetadataDefinitionAction(
                    parameter["id"],
                    parameter["type"],
                    formatMetadataExpression(parameter, response)
                  )
                )
              )
            )
        )
      );
    })
  );
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private httpClient: NgxDhis2HttpClientService,
    private metadataService: MetadataInfoService
  ) {}
}
