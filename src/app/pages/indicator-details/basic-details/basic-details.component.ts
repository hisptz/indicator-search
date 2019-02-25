import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-client.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';

import * as indicators from '../../../store/indicators/indicators.actions';
import { getDataSetsInfoByDataElementId } from 'src/app/store/indicators/indicators.selectors';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {

  @Input() indicator: any;
  @Input() ngStyle: { [key: string]: string; }
  dataSet$: Observable<any>;
  dataSets: any[] = [];
  legendSet: any;
  constructor(private httpClient: HttpClientService, private store: Store<AppState>) { }

  ngOnInit() {
    if (this.indicator) {
      if (this.indicator.dataSets.length == 0) {
        this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdAction(this.getDataElementId(this.indicator.numerator)));

        this.dataSet$ = this.store.select(getDataSetsInfoByDataElementId);
        if (this.dataSet$) {
          this.dataSet$.subscribe((dataSet) => {
            if (dataSet.length > 0) {
              this.dataSets = dataSet;
            }
          })
        }
      }
      // get legendserts defn if any
      if (this.indicator.legendSet) {
        console.log(this.indicator);
        this.httpClient.get('legendSets/' + this.indicator.legendSet.id +'.json?fields=id,name,legends[id,name,startValue,endValue,color]&paging=false')
      .subscribe((legendSet) => {
        if (legendSet) {
          this.legendSet = legendSet;
        }
      })
      }
    }
  }

  getDataElementId(indicatorExpression) {
    return indicatorExpression.split('}')[0].split('#{')[1].split('.')[0];
  }
}
