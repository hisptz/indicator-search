import { Injectable } from '@angular/core';
import {Constants} from './costants';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class HttpClientService {
  public APIURL = '../../../';
  constructor(private http: HttpClient) {
    // this.APIURL = constant.root_api;
  }

  createAuthorizationHeader(headers: Headers, options?) {
    if (options) {
      options.forEach((key, values) => {
        headers.append(key, options[key]);
      });
    }
  }

  get(url) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.APIURL + url).pipe(catchError(this._handleError));
  }

  get2(url) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get( url).pipe(catchError(this._handleError));
  }

  post(url, data, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.post(this.APIURL + url, data).
          pipe(catchError(this._handleError))
  }
  put(url, data, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.put(this.APIURL + url, data).pipe(catchError(this._handleError))
  }

  delete(url, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.delete(this.APIURL + url).pipe(catchError(this._handleError))
  }

  responseHandler() {
    return (res) => {
      try {
        const returnJSON = res.json();
        return returnJSON;
      }catch (e) {
        location.reload();
        return null;
      }
    };
  }


  private _handleError(err: HttpErrorResponse) {
    let error = null;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      error = {
        message: err.error,
        status: err.status,
        statusText: err.statusText
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      error = {
        message: err.error instanceof Object ? err.error.message : err.error,
        status: err.status,
        statusText: err.statusText
      };
    }
    return new error;
  }

}
