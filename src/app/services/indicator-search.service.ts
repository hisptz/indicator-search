import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class IndicatorSearchService {

  constructor(private httpClient: HttpClientService) { }

  // load indicators
  loadIndicatorsByPage(page) {
    let url = 'indicators.json?fields=id,name,numerator,denominator,indicatorType[name],';
    url += 'denominatorDescription,numeratorDescription,user[name],lastUpdated,indicatorGroups[id]&pageSize=400&page=' + page;
    return this.httpClient.get(url);
  }
}
