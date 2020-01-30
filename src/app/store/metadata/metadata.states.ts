import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

export interface MetadataExpressionDefinitionState extends EntityState<any> {}

export const metadataExpDefnAdapter: EntityAdapter<any> = createEntityAdapter<
  any
>();

export const initialMetadataExpressionDefinitionState = metadataExpDefnAdapter.getInitialState(
  {}
);
