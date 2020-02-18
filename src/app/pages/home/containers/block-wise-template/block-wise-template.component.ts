import { Component, OnInit, Input } from "@angular/core";
import * as _ from "lodash";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducers";
import { getMetadataDefinitionEntities } from "src/app/store/metadata/metadata.selectors";
import { Observable } from "rxjs";

@Component({
  selector: "app-block-wise-template",
  templateUrl: "./block-wise-template.component.html",
  styleUrls: ["./block-wise-template.component.css"]
})
export class BlockWiseTemplateComponent implements OnInit {
  @Input() metadataGroups: any;
  @Input() metadataInfo: any;

  @Input() referenceConstants: any;
  @Input() formulaPattern: any;
  @Input() replacingElement: any;
  formattedMetadata: Array<any> = [];
  metadataDefnEntities$: Observable<any>;
  isProgramIndicatorsSelected: Boolean = false;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    if (this.metadataInfo) {
      console.log("metadataGroups ", this.metadataGroups);
      console.log("metadataInfo ", this.metadataInfo);
      if (this.metadataInfo.type == "programIndicator") {
        this.isProgramIndicatorsSelected = true;
      } else {
        this.isProgramIndicatorsSelected = false;
      }
      this.metadataDefnEntities$ = this.store.select(
        getMetadataDefinitionEntities
      );
      this.formattedMetadata = [];
      _.map(this.metadataGroups, indicatorGroup => {
        this.formattedMetadata.push({
          isGroup: true,
          groupName: indicatorGroup.name,
          colSpan: 6
        });
        _.map(this.metadataInfo["data"], metadata => {
          if (
            _.filter(
              metadata.indicatorGroups
                ? metadata.indicatorGroups
                : metadata.programIndicatorGroups,
              {
                id: indicatorGroup.id
              }
            ).length > 0
          ) {
            let metadataObj = {
              id: metadata.id,
              name: metadata.name,
              shortName: metadata.shortName,
              description: metadata.description
            };
            this.formattedMetadata.push(metadataObj);
          }
        });
      });
    }
  }
}
