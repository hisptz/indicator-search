import {
  MetadataExpressionDefinitionState,
  metadataExpDefnAdapter,
  initialMetadataExpressionDefinitionState
} from "./metadata.states";
import { MetadataAction, MetadataActionsTypes } from "./metadata.actions";

export function metadataExpressionDefnReducer(
  state: MetadataExpressionDefinitionState = initialMetadataExpressionDefinitionState,
  action: MetadataAction
) {
  switch (action.type) {
    case MetadataActionsTypes.AddLoadedMetadataDefinition: {
      return metadataExpDefnAdapter.addOne(
        {
          id: action.id,
          type: action.expressionType,
          expression: action.definitionInfo
        },
        { ...state }
      );
    }
    default:
      return state;
  }
}
