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
                this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdsAction(this.getAllDataElements(this.indicator)))
                this.dataSetsOfIndicators$ = this.store.select(getDataSetsOfIndicators);
                if (this.dataSetsOfIndicators$) {
                  this.dataSetsOfIndicators$.subscribe((dataSetsOfIndicators) => {
                    if(dataSetsOfIndicators) {
                      this.allSearchedDataSets = dataSetsOfIndicators;
                    }
                  })
                }
              }
            } else {
              this.store.dispatch(new indicators.LoadIndicatorDataSetByDataElementIdsAction(this.getAllDataElements(this.indicator)));
                this.dataSetsOfIndicators$ = this.store.select(getDataSetsOfIndicators);
                if (this.dataSetsOfIndicators$) {
                  this.dataSetsOfIndicators$.subscribe((dataSetsOfIndicators) => {
                    if(dataSetsOfIndicators) {
                      this.allSearchedDataSets = dataSetsOfIndicators;
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
    return indicatorExpression.split('}')[0].split('{')[1].split('.')[0];
  }

  getAllDataElements(indicator) {
    let dataElements = [];
    indicator.numerator.split('}').forEach((element) => {
      if (element.length > 11) {
        if (element.indexOf('I') == 0 || element.indexOf('I{') == 1) {
          const obj = {
            "category": "programIndicator",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('#') == 0 || element.indexOf('#{') == 1) {
          const obj = {
            "category": "dataElement",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('OU') == 0 || element.indexOf('OU') == 1) {
          const obj = {
            "category": "ORG_UNIT",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('D{')  == 0 || element.indexOf('D{')  == 0) {
          const obj = {
            "category": "PROGRAM",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        }
      }
    });

    indicator.denominator.split('}').forEach((element) => {
      if (element.length > 11) {
        if (element.indexOf('I') == 0 || element.indexOf('I{') == 1) {
          const obj = {
            "category": "programIndicator",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('#') == 0 || element.indexOf('#{') == 1) {
          const obj = {
            "category": "dataElement",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('OU') == 0 || element.indexOf('OU') == 1) {
          const obj = {
            "category": "ORG_UNIT",
            "id": element.split('{')[1].split('.')[0]
          }
          dataElements.push(obj);
        } else if (element.indexOf('D{')  == 0 || element.indexOf('D{')  == 0) {
          const obj = {
            "category": "PROGRAM",
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
    console.log('expression', expression)
    expression.split('}').forEach((element) => {
      if (element.length > 11) {
        if (element.indexOf('I{') == 0 || element.indexOf('I{') == 1) {
          const obj = {
            "category": "programIndicator",
            "id": element.split('{')[1].split('.')[0]
          }
          definitions.push(obj);
        } else if (element.indexOf('#{') == 0 || element.indexOf('#{') == 1) {
          const obj = {
            "category": "dataElement",
            "id": element.split('{')[1].split('.')[0]
          }
          definitions.push(obj);
        } else if (element.indexOf('OU') == 0 || element.indexOf('OU') == 1) {
          const obj = {
            "category": "ORG_UNIT",
            "id": element.split('{')[1].split('.')[0]
          }
          definitions.push(obj);
        }  else if (element.indexOf('D{') == 0 || element.indexOf('D{') == 1) {
          const obj = {
            "category": "PROGRAM",
            "id": element.split('{')[1].split('.')[0]
          }
          definitions.push(obj);
        }
      }
    });
    console.log('_.uniqBy(definitions)', _.uniqBy(definitions, 'id'))
    _.map(_.uniqBy(definitions, 'id'), (definition) => {
      if (_.find(this.getSources(allSearchedDataSets), {'dataElementId': definition.id})) {
        if (definition.category == 'programIndicator') {
          let obj = {
            dataSet: _.find(this.getSources(allSearchedDataSets), {'dataElementId': definition.id})
          }
          dataSetsOfIndicators.push(obj)
        } else if (definition.category == 'dataElement') {
          console.log('this.getSources(allSearchedDataSets)', this.getSources(allSearchedDataSets))
          _.map(this.getSources(allSearchedDataSets), (source: any) => {
            if (source.dataElementId == definition.id) {
              dataSetsOfIndicators.push(source)
            }
          })
          // dataSetsOfIndicators.push(_.find(this.getSources(allSearchedDataSets), {'dataElementId': definition.id}));
        } else if (definition.category == 'PROGRAM') {
          let obj = {
            dataSet: _.find(this.getSources(allSearchedDataSets), {'dataElementId': definition.id})
          }
          dataSetsOfIndicators.push(obj)
        }
      }
    });
    return  _.uniqBy(dataSetsOfIndicators, 'id');
  }

  getExpressionDefinition(expression) {
    return expression;
  }

  getAllPossibleSources(indicator) {
    let sources = '';
    const expressionCombined = indicator.numerator + indicator.denominator;
    if (expressionCombined.indexOf('#{') > -1) {
      sources += 'Routine aggregate data collection tools';
    }
    if (expressionCombined.indexOf('D{') > -1 || expressionCombined.indexOf('I{') > -1) {
      sources += ' and event based sources (programs)'
    }
    if (expressionCombined.indexOf('OU') > -1) {
      sources += ', organisation unit tree'
    }
    return sources;
  }

  getSources(allSources) {
    let mappedSources = [];
    _.map(_.uniqBy(allSources, 'id'), (source: any) => {
      if (source['dataSetElements']) {
        source['dataSetElements'].forEach((dataSetElement) => {
          let obj = {
            category: "Aggregate",
            name: dataSetElement.dataSet.name,
            formType: dataSetElement.dataSet.formType,
            id: dataSetElement.dataSet.id,
            periodType: dataSetElement.dataSet.periodType,
            timelyDays: dataSetElement.dataSet.timelyDays,
            dataElementId: source.id
          }
          mappedSources.push(obj)
        });
      } else {
        let obj = {
          category: "Event",
          name: source.name,
          id: source.id,
          dataElementId: source.id
        }
        mappedSources.push(obj)
      }
    })
    return _.uniqBy(mappedSources, 'id');
  }

}
