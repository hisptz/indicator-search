import { createSelector } from "@ngrx/store";
import { AppState } from "../app.reducers";
import { MetadataExpressionDefinitionState } from "./metadata.states";

const metadataInfosEntitites = (state: AppState) =>
  state.metadataExpressionDefinitions.entities;

export const getMetadataDefinitionEntities = createSelector(
  metadataInfosEntitites,
  (data: MetadataExpressionDefinitionState) => data
);
