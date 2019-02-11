import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { Observable } from 'rxjs';
export interface IndicatorGroup {
  id: string;
  name: string;
  indicators: any;
}

@Injectable()
export class IndicatorGroupService {

  private _indicatorGroups: any = null;
  private baseUrl: string;

  constructor(private http: HttpClient ) { }

  // load indicators
  loadIndicators(page) {
    let url = '../../../api/indicators.json?fields=id,name,numerator,denominator,indicatorType[name],';
    url += 'denominatorDescription,numeratorDescription,user[name],lastUpdated,indicatorGroups[id]&pageSize=400&page=' + page;
    return this.http.get( url );
  }

  // get all indicator groups
  loadAllGroups(): Observable<any> {
    return Observable.create(observer => {
      if ( this._indicatorGroups ) {
        observer.next(this._indicatorGroups);
        observer.complete();
      }else {
        this.http.get('../../../api/indicatorGroups.json?fields=id,name,indicators[id]&paging=false')
          .subscribe((groups: any) => {
              this._indicatorGroups = groups;
              observer.next(this._indicatorGroups);
              observer.complete();
            },
            error => {
              observer.error('some error occur');
            });
      }
    });
  }

  load(id: string ): Observable<any> {
    return this.http.get(`../../../api/indicatorGroups/${id}.json?fields=id,name,indicators[id,name,indicatorType[id,name]]`)
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
