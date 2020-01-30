import { Action } from "@ngrx/store";

export enum MetadataActionsTypes {
  LoadMetadataDefinitions = "[Expression definition] load metadata definition",
  AddLoadedMetadataDefinition = "[Expression definition] add loaded metadata definition",
  LoadingMetadataDefinitionFail = "[Expression definition] loading metadata definition fails"
}

export class LoadMetadataDefinitionsAction implements Action {
  readonly type = MetadataActionsTypes.LoadMetadataDefinitions;
  constructor(public indIdWithExpression: Array<any>) {}
}

export class AddLoadedMetadataDefinitionAction implements Action {
  readonly type = MetadataActionsTypes.AddLoadedMetadataDefinition;
  constructor(
    public id: string,
    public expressionType: string,
    public definitionInfo: any
  ) {}
}

export class LoadingMetadataDefinitionFail implements Action {
  readonly type = MetadataActionsTypes.LoadingMetadataDefinitionFail;
  constructor(public error: any) {}
}

export type MetadataAction =
  | LoadMetadataDefinitionsAction
  | AddLoadedMetadataDefinitionAction
  | LoadingMetadataDefinitionFail;
