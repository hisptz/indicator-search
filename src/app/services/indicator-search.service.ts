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

  indicators: any[]=[];
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
    if (pagerDefinitions.total < 200) {
      pageSize = 20;
      pageCount = Math.ceil(pagerDefinitions.total / pageSize);
    } else if (pagerDefinitions.total <= 3000 && pagerDefinitions.total > 200) {
      pageSize = 100;
      pageCount = Math.ceil(pagerDefinitions.total / pageSize);
    } else if (pagerDefinitions.total > 3000) {
      pageSize = 400;
      pageCount = Math.ceil(pagerDefinitions.total / pageSize);
      // pageSize = pagerDefinitions.pageSize;
      // pageCount = pagerDefinitions.pageCount;
    }
    return from(
      _.map(
        _.range(1, pageCount + 1),
        pageNumber =>
        'indicators.json?fields=:all,lastUpdatedBy[id,name],displayName,id,name,' +
        'numeratorDescription,denominatorDescription,denominator,numerator,annualized,decimals,' +
        'indicatorType[name],user[name],attributeValues[value,attribute[name]],indicatorGroups[id,name,indicators~size],' +
        'legendSets[id,name,symbolizer,legends~size],dataSets[id,name]&pageSize='
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

  _indicatorProperties(indicatorsObj): Observable<any> {
    this.indicators = [...this.indicators, ...indicatorsObj]
    console.log(this.indicators);
    return from(
      _.map(
        this.indicators, (indicator) => 
        'indicators/' + indicator.id + '.json?fields=:all,lastUpdatedBy[id,name],displayName,id,name,' +
            'numeratorDescription,denominatorDescription,denominator,numerator,annualized,decimals,' +
            'indicatorType[name],user[name],indicatorGroups[name,indicators~size]'
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

  _loadIndicatorsSourcesByDataElements(dataSetElements): Observable<any> {
    return from(
     _.map(
        dataSetElements,
        (dataSetElement) => {
          let url = '';
          if (dataSetElement.category == 'programIndicator') {
            // console.log('programIndicator')
            url = 'programIndicators/' + dataSetElement.id + '.json?fields=id,name,program[id,name],filter,expression';
          } else if(dataSetElement.category == 'dataElement') {
            url = 'dataElements/' + dataSetElement.id + '.json?fields=id,name,dataSetElements[dataSet[id,name,periodType,timelyDays,formType]]';
          } else if (dataSetElement.category == 'PROGRAM') {
            url = 'programs/' + dataSetElement.id +'.json?fields=id,name,trackedEntityType[id,name]';
          }
          return url;
        }
      )
    ).pipe(
      mergeMap(
        (url: string) =>
        this.httpClient.get(url).pipe(
            map(
              (dataSetElements: any) =>
              dataSetElements
            )
          ),
      null,
      1
      )
    )
  }
}