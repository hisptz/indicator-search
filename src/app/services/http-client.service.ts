import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Constants} from './costants';
import {Observable} from "rxjs/Observable";

@Injectable()
export class HttpClientService {
  public APIURL = '../../../';
  constructor(private http: Http) {
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
    return this.http.get(this.APIURL + url, {
      headers: headers
    }).map(this.responseHandler()).catch(this.handleError);
  }

  get2(url) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get( url, {
      headers: headers
    }).map(this.responseHandler()).catch(this.handleError);
  }

  post(url, data, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.post(this.APIURL + url, data, {
      headers: headers
    }).map(this.responseHandler());
  }
  put(url, data, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.put(this.APIURL + url, data, {
      headers: headers
    }).map(this.responseHandler());
  }

  delete(url, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.delete(this.APIURL + url, {
      headers: headers
    }).map(this.responseHandler());
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

  handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    // let errMsg: string;
    // if (error instanceof Response) {
    //   const body = error.json() || '';
    //   const err = body.error || JSON.stringify(body);
    //   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    // } else {
    //   errMsg = error.message ? error.message : error.toString();
    // }
    return Observable.throw(error);
  }

}
