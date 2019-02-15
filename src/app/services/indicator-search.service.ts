import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, from } from 'rxjs';
import { map, mergeMap, tap, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { AllIndicatorsState } from '../store/indicators/indicators.state';

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

  loadIndicatorsById(id) {
    let url = 'indicators/' + id + '.json?fields=id,name,numerator,denominator,indicatorType[name],';
    url += 'denominatorDescription,numeratorDescription,user[name],lastUpdated,indicatorGroups[id]';
    return this.httpClient.get(url);
  }

  _loadAllIndicators(pagerDefinitions): Observable<any> {
    // format pageSize as per number of indicators
    let pageSize = 20; let pageCount = 1
    console.log(pagerDefinitions)
    if (pagerDefinitions.total < 100) {
      pageSize = 20;
      pageCount = Math.ceil(pagerDefinitions.total / pageSize);
      console.log(pageCount)
    } else {
      pageSize = pagerDefinitions.pageSize;
      pageCount = pagerDefinitions.pageCount;
    }
    return from(
      _.map(
        _.range(1, pageCount + 1),
        pageNumber =>
        'indicators.json?fields=id,name,numerator,denominator,indicatorType[name],' +
        'denominatorDescription,numeratorDescription,user[name],lastUpdated,indicatorGroups[id]&pageSize='
        + pageSize +
        '&page=' + pageNumber
      )
    ).pipe(
      mergeMap(
        (url: string) =>
        this.httpClient.get(url).pipe(
            map(
              (indicators: any) =>
                indicators
            )
          ),
      null,
      1
      )
    )
  }
}
