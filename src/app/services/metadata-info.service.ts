import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";

@Injectable({
  providedIn: "root"
})
export class MetadataInfoService {
  loadMetadataInfo(parameter): Observable<any> {
    if (parameter["type"] == "programIndicatorExpression") {
      if (parameter["id"].indexOf("program") > -1) {
        return this.httpClient.get(
          "programStages.json?fields=id,name&filter=id:in:[" +
            parameter["expression"].join(",") +
            "]"
        );
      } else {
        return this.httpClient.get(
          "dataElements.json?fields=id,name&filter=id:in:[" +
            parameter["expression"].join(",") +
            "]"
        );
      }
    } else {
      return this.httpClient.get(
        "expressions/description?expression=" +
          encodeURIComponent(parameter["expression"])
      );
    }
  }

  constructor(private httpClient: NgxDhis2HttpClientService) {}
}
