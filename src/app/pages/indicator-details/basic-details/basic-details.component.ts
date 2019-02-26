import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-client.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import * as _ from 'lodash';

import * as indicators from '../../../store/indicators/indicators.actions';
import { getDataSetsInfoByDataElementId, getAllIndicatorWithDetails, getDataSetsOfIndicators } from 'src/app/store/indicators/indicators.selectors';

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
  dataSetsOfIndicators$: Observable<any>;
  allSearchedDataSets: any[] = []; 
  constructor(private httpClient: HttpClientService, private store: Store<AppState>) { }

  ngOnInit() {
    if (this.indicator) {
        console.log('here')
        console.log(this.getAllDataElements(this.indicator))
        // check if the dataset have ebeen loaded
        this.dataSet$ = this.store.select(getDataSetsInfoByDataElementId);
        if (this.dataSet$) {
          this.dataSet$.subscribe((dataSetElements) => {
            if (dataSetElements.length > 0) {
              if(_.find(dataSetElements, {'id': this.getDataElementId(this.indicator.numerator)})) {
                // got the dataset in store
                this.dataSets = _.find(dataSetElements, {'id': this.getDataElementId(this.indicator.numerator)})['dataSetElements'];
                this.dataSetsOfIndicators$ = this.store.select(getDataSetsOfIndicators);
                if (this.dataSetsOfIndicators$) {
                  this.dataSetsOfIndicators$.subscribe((dataSetsOfIndicators) => {
                    if(dataSetsOfIndicators) {
                      this.allSearchedDataSets = dataSetsOfIndicators;
                    }
                  })
                }
              } else {
                this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdAction(this.getDataElementId(this.indicator.numerator)));
                this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdsAction(this.getAllDataElements(this.indicator)))
                this.dataSetsOfIndicators$ = this.store.select(getDataSetsOfIndicators);
                if (this.dataSetsOfIndicators$) {
                  this.dataSetsOfIndicators$.subscribe((dataSetsOfIndicators) => {
                    if(dataSetsOfIndicators) {
                      this.allSearchedDataSets = dataSetsOfIndicators;
                    }
                  })
                }
                this.dataSet$ = this.store.select(getDataSetsInfoByDataElementId);
                if (this.dataSet$) {
                  this.dataSet$.subscribe((dataSetElements) => {
                    if (dataSetElements.length > 0) {
                      _.map(dataSetElements, (dataSetElement: any) => {
                        if (dataSetElement.id == this.getDataElementId(this.indicator.numerator)) {
                          this.dataSets = dataSetElement['dataSetElements'];
                        }
                      })
                    }
                  })
                }
              }
            } else {
              this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdAction(this.getDataElementId(this.indicator.numerator)));
                this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdsAction(this.getAllDataElements(this.indicator)));
                this.dataSetsOfIndicators$ = this.store.select(getDataSetsOfIndicators);
                if (this.dataSetsOfIndicators$) {
                  this.dataSetsOfIndicators$.subscribe((dataSetsOfIndicators) => {
                    if(dataSetsOfIndicators) {
                      this.allSearchedDataSets = dataSetsOfIndicators;
                    }
                  })
                }
                this.dataSet$ = this.store.select(getDataSetsInfoByDataElementId);
                if (this.dataSet$) {
                  this.dataSet$.subscribe((dataSetElements) => {
                    if (dataSetElements.length > 0) {
                      _.map(dataSetElements, (dataSetElement: any) => {
                        if (dataSetElement.id == this.getDataElementId(this.indicator.numerator)) {
                          this.dataSets = dataSetElement['dataSetElements'];
                        }
                      })
                    }
                  })
                }
            }
          })
        }
      // get legendserts defn if any
      if (this.indicator.legendSet) {
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

  getAllDataElements(indicator) {
    let dataElements = [];
    indicator.numerator.split('}').forEach((element) => {
      if (element.length > 11) {
        if (element.indexOf('I') == 0) {
          const obj = {
            "category": "programIndicator",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('#') == 0) {
          const obj = {
            "category": "dataElement",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('OU') == 0) {
          const obj = {
            "category": "ORG_UNIT",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        }
      }
    });

    indicator.denominator.split('}').forEach((element) => {
      if (element.length > 11) {
        if (element.indexOf('I') > -1) {
          const obj = {
            "category": "programIndicator",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('#') > -1) {
          const obj = {
            "category": "dataElement",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('OU') > -1) {
          const obj = {
            "category": "ORG_UNIT",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        }
      }
    });
    return dataElements;
  }

  getDataSetByDataElement(allSearchedDataSets, expression) {
    let definitions = []; let dataSetsOfIndicators = [];
    expression.split('}').forEach((element) => {
      if (element.length > 11) {
        if (element.indexOf('I') == 0) {
          const obj = {
            "category": "programIndicator",
            "id": element.split('{')[1].split('.')[0]
          }
          definitions.push(obj);
        } else if (element.indexOf('#') == 0) {
          const obj = {
            "category": "dataElement",
            "id": element.split('{')[1].split('.')[0]
          }
          definitions.push(obj);
        } else if (element.indexOf('OU') == 0) {
          const obj = {
            "category": "ORG_UNIT",
            "id": element.split('{')[1].split('.')[0]
          }
          definitions.push(obj);
        }
      }
    });
    _.map(definitions, (definition) => {
      if (_.find(allSearchedDataSets, {'id': definition.id})) {
        if (definition.category == 'programIndicator') {
          let obj = {
            dataSet: _.find(allSearchedDataSets, {'id': definition.id})['program']
          }
          dataSetsOfIndicators.push(obj)
        } else if (definition.category == 'dataElement') {
          dataSetsOfIndicators.push(_.find(allSearchedDataSets, {'id': definition.id})['dataSetElements'][0]);
        }
      }
    });
    return  _.uniq(dataSetsOfIndicators);
  }

  getExpressionDefinition(expression) {
    return expression;
  }
}
