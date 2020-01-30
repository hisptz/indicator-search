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

@Injectable()
export class MetadataEffects {
  @Effect({ dispatch: false })
  metadataExpressionDefinitions$: Observable<any> = this.actions$.pipe(
    ofType(MetadataActionsTypes.LoadMetadataDefinitions),
    switchMap(action => {
      return from(action["indIdWithExpression"]).pipe(
        mergeMap(parameter =>
          this.httpClient
            .get(
              "expressions/description?expression=" +
                encodeURIComponent(parameter["expression"])
            )
            .pipe(
              map(response =>
                this.store.dispatch(
                  new AddLoadedMetadataDefinitionAction(
                    parameter["id"],
                    parameter["type"],
                    response["description"]
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
    private httpClient: NgxDhis2HttpClientService
  ) {}
}
