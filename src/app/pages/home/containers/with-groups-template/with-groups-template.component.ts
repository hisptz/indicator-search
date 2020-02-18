import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import * as _ from "lodash";
import { getMetadataDefinitionEntities } from "src/app/store/metadata/metadata.selectors";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducers";

@Component({
  selector: "app-with-groups-template",
  templateUrl: "./with-groups-template.component.html",
  styleUrls: ["./with-groups-template.component.css"]
})
export class WithGroupsTemplateComponent implements OnInit {
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
              groupId: indicatorGroup.id,
              groupName: indicatorGroup.name,
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
