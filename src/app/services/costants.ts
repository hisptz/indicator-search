import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * Created by kelvin on 9/19/16.
 */
@Injectable()
export class Constants {
  root_dir: string = null;
  system_info: any = null;
  root_api = '../../../api/25/';

  constructor(private http: HttpClient) {
    this.root_dir = '../../../';
    this.loadVersion().subscribe((system_info: any) => {
      if (system_info.version >= 2.25) {
        this.root_api = '../../../api/25/';
      } else {
        this.root_api = '../../../api/';
      }
    });

  }

  load() {
    return this.http.get('manifest.webapp')
  }

  // load system version
  loadVersion() {
    return Observable.create(observer => {
      if (this.system_info !== null) {
        observer.next(this.system_info);
        observer.complete();
      }else {
        this.http.get('../../../api/system/info.json')
          .subscribe((useInfo) => {
              this.system_info = useInfo;
              observer.next(this.system_info);
              observer.complete();
            },
            error => {
              observer.error('some error occur');
            });
      }
    });
  }

  private handleError(error: Response | any) {
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
