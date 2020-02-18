import { Component, OnInit, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducers";
import * as _ from "lodash";
import { LoadMetadataDefinitionsAction } from "src/app/store/metadata/metadata.actions";
import { getMetadataDefinitionEntities } from "src/app/store/metadata/metadata.selectors";
import { Observable } from "rxjs";

@Component({
  selector: "app-download-template",
  templateUrl: "./download-template.component.html",
  styleUrls: ["./download-template.component.css"]
})
export class DownloadTemplateComponent implements OnInit {
  @Input() metadataInfo: any;
  @Input() metadataGroups: any;
  @Input() metadataDefnEntities: any;
  @Input() selectedTemplate: string;
  referenceConstants = {
    "V{enrollment_date}": "Enrollment date ",
    "d2:daysBetween": "Days between ",
    "V{event_count}": "Count of events "
  };
  formulaPattern = /#\{.+?\}/g;
  replacingElement = /[#\{\}]/g;
  programIndicatorExpressionsAndFilters = [];
  // match.replace(/[#\{\}]/g, "");
  metadataDefnEntities$: Observable<any>;
  formattedMetadata: Array<any> = [];
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    if (this.metadataInfo && this.metadataInfo["data"]) {
      let parameters = [];
      if (this.metadataInfo.type == "indicator") {
        _.map(this.metadataInfo["data"], metadata => {
          const numeratorParameters = {
            id: metadata.id + "-nume",
            type: "numerator",
            expression: metadata.numerator
          };

          const denominatorParameters = {
            id: metadata.id + "-deno",
            type: "denominator",
            expression: metadata.denominator
          };
          parameters.push(numeratorParameters);
          parameters.push(denominatorParameters);
        });
        this.store.dispatch(new LoadMetadataDefinitionsAction(parameters));
        this.metadataDefnEntities$ = this.store.select(
          getMetadataDefinitionEntities
        );
      } else {
        let elementsToEvaluateExpression = [];
        this.programIndicatorExpressionsAndFilters = [];
        _.map(this.metadataInfo["data"], metadata => {
          if (
            metadata["filter"] &&
            metadata["filter"].match(this.formulaPattern)
          ) {
            elementsToEvaluateExpression = _.union(
              elementsToEvaluateExpression,
              metadata["filter"].match(this.formulaPattern)
            );

            let objProgramStage = {
              id: metadata.id + "-filter-program",
              type: "programIndicatorExpression",
              expression: [],
              expressionData: metadata["filter"]
            };

            let objElements = {
              id: metadata.id + "-filter-element",
              type: "programIndicatorExpression",
              expression: [],
              expressionData: metadata["filter"]
            };

            _.map(metadata["filter"].match(this.formulaPattern), element => {
              objProgramStage.expression.push(
                _.replace(element, this.replacingElement, "").split(".")[0]
              );

              objElements.expression.push(
                _.replace(element, this.replacingElement, "").split(".")[1]
              );
              this.programIndicatorExpressionsAndFilters.push(objProgramStage);
              this.programIndicatorExpressionsAndFilters.push(objElements);
            });
          }

          if (
            metadata["expression"] &&
            metadata["expression"].match(this.formulaPattern)
          ) {
            let objProgramStage = {
              id: metadata.id + "-filter-program",
              type: "programIndicatorExpression",
              expression: [],
              expressionData: metadata["filter"]
            };

            let objElements = {
              id: metadata.id + "-filter-element",
              type: "programIndicatorExpression",
              expression: [],
              expressionData: metadata["expression"]
            };

            _.map(
              metadata["expression"].match(this.formulaPattern),
              element => {
                objProgramStage.expression.push(
                  _.replace(element, this.replacingElement, "").split(".")[0]
                );

                objElements.expression.push(
                  _.replace(element, this.replacingElement, "").split(".")[1]
                );
                this.programIndicatorExpressionsAndFilters.push(
                  objProgramStage
                );
                this.programIndicatorExpressionsAndFilters.push(objElements);
              }
            );
          }
        });

        console.log(_.uniqBy(this.programIndicatorExpressionsAndFilters, "id"));
        this.store.dispatch(
          new LoadMetadataDefinitionsAction(
            _.uniqBy(this.programIndicatorExpressionsAndFilters, "id")
          )
        );
        this.metadataDefnEntities$ = this.store.select(
          getMetadataDefinitionEntities
        );
      }
      this.formattedMetadata = this.metadataInfo["data"];
    }
  }
}
