import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import * as _ from "lodash";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { ExportService } from "src/app/services/export.service";
import { DatePipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducers";
import { Observable } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  selectedItem: string;
  metadataIdentifiers: any;
  metadataIdentifiersArr: any[] = [];
  systemInfo: any;
  loadedMetadataInfo: any;
  loadedMetadataGroups: any;
  isViewAllIndicatorDownloadTemplateSet: Boolean = false;
  html: any;
  isprintSet: Boolean = false;
  selectedTemplate: string = "list-with-groups";
  metadataDefnEntities$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: NgxDhis2HttpClientService,
    private exportService: ExportService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.httpClient.get("system/info").subscribe(systemSettings => {
      this.systemInfo = systemSettings;
    });
    this.route.params.forEach((params: Params) => {
      if (params["selected"] != undefined) {
        if (params["selected"] == "all" && !params["ids"]) {
          this.metadataIdentifiers = [];
          this.selectedItem = params["selected"];
          this.router.navigate(["dictionary/all"]);
        } else {
          this.selectedItem = params["selected"];
          let identifiers = [];
          params["ids"].split(",").forEach(param => {
            identifiers.push(param);
          });
          if (this.selectedItem != "all") {
            identifiers.push(this.selectedItem);
          }
          this.metadataIdentifiers = _.uniq(identifiers);
          this.router.navigate([
            "dictionary/" +
              _.uniq(identifiers).join(",") +
              "/selected/" +
              this.selectedItem
          ]);
        }
      } else {
        this.metadataIdentifiers = this.metadataIdentifiersArr;
        this.selectedItem = "all";
        this.router.navigate([
          "dictionary/" +
            _.uniq(this.metadataIdentifiers).join(",") +
            "/selected/" +
            this.selectedItem
        ]);
      }
    });
  }

  dictionaryItemId(listOfItemsObj) {
    if (listOfItemsObj.selected == "all") {
      this.metadataIdentifiers = listOfItemsObj["otherSelectedIds"];
      if (this.metadataIdentifiers.length > 0) {
        let identifiers = [];
        _.map(this.metadataIdentifiers, identifier => {
          if (identifier != "all") {
            identifiers.push(identifier);
          }
        });
        this.metadataIdentifiers = identifiers;
        this.selectedItem = listOfItemsObj.selected;
        this.router.navigate([
          "dictionary/" +
            _.uniq(identifiers).join(",") +
            "/selected/" +
            listOfItemsObj.selected
        ]);
      } else {
        this.router.navigate(["dictionary/all"]);
      }
    } else {
      let identifiers = [];
      listOfItemsObj["otherSelectedIds"].forEach(identifier => {
        if (identifier != "all") {
          identifiers.push(identifier);
        }
      });
      if (_.indexOf(identifiers, listOfItemsObj.selected) < 0) {
        identifiers.push(listOfItemsObj.selected);
      }
      this.metadataIdentifiers = _.uniq(identifiers);
      this.selectedItem = listOfItemsObj.selected;
      this.router.navigate([
        "dictionary/" +
          _.uniq(identifiers).join(",") +
          "/selected/" +
          listOfItemsObj.selected
      ]);
    }
  }

  getSharedLink(identifiers) {
    if (this.systemInfo) {
      let selBox = document.createElement("textarea");
      selBox.style.position = "fixed";
      selBox.style.left = "0";
      selBox.style.top = "0";
      selBox.style.opacity = "0";
      if (identifiers.length > 0) {
        if (this.systemInfo.instanceBaseUrl) {
          selBox.value =
            this.systemInfo.instanceBaseUrl +
            "/api/apps/Indicator-Dictionary/index.html#/dictionary/" +
            _.uniq(identifiers).join(",") +
            "/selected/" +
            this.selectedItem;
        } else {
          selBox.value =
            this.systemInfo.contextPath +
            "/api/apps/Indicator-Dictionary/index.html#/dictionary/" +
            _.uniq(identifiers).join(",") +
            "/selected/" +
            this.selectedItem;
        }
      } else {
        selBox.value =
          this.systemInfo.contextPath +
          "/api/apps/Indicator-Dictionary/index.html#/dictionary/all";
      }
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand("copy");
      document.body.removeChild(selBox);
      let messagePart = document.getElementById("copied-message");
      setTimeout(function() {
        messagePart.style.display = "inline-block";
        messagePart.style.marginBottom = "-20px";
      }, 100);
      setTimeout(function() {
        messagePart.style.display = "none";
      }, 1000);
    }
  }

  metadataInfo(loadedMetadata) {
    this.loadedMetadataInfo = loadedMetadata;
  }

  metadataGroupsInfo(metadataGroups) {
    this.loadedMetadataGroups = metadataGroups;
  }

  toggleDownloadTemplateAndDictionaryList() {
    this.isViewAllIndicatorDownloadTemplateSet = !this
      .isViewAllIndicatorDownloadTemplateSet;
  }

  exportMetadataInformation(id) {
    this.html = document.getElementById(id).outerHTML;
    let theDate = new Date();
    this.datePipe.transform(theDate, "yyyy-MM-dd");
    this.exportService.exportXLS(
      "all_metadata_template_generated_on_" +
        this.datePipe.transform(theDate, "yyyy-MM-dd"),
      this.html
    );
  }

  printPDF() {
    setTimeout(function() {
      this.isprintSet = true;
      window.print();
    }, 500);
  }

  setDownloadTemplate(type) {
    this.selectedTemplate = type;
  }
}
