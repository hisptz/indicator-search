import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import {Headers, Http, Response} from '@angular/http';
import {HttpClientService} from '../../services/http-client.service';
import {Constants} from '../../services/costants';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application.state';
import {SetSelectedIndicatorAction} from '../../store/actions/store.data.action';
import * as _ from 'lodash';

@Component({
  moduleId: module.id,
  selector: 'app-metadata-dictionary',
  templateUrl: './metadata-dictionary.component.html',
  styleUrls: ['./metadata-dictionary.component.css']
})
export class MetadataDictionaryComponent implements OnInit, OnDestroy {
  indicators = [];
  CompleteData = [];
  dataelements = [];
  dataelementsNumerator = [];
  datasets = [];
  events = [];
  programInd = [];
  isIndicator = false;
  isDataelements = false;
  isDataset = false;
  isEvents = false;
  isProgramInd = false;
  showingLoading = false;
  progressMessage = 'Preparing metadata dictionary';
  @Input() metadataidentifiers: string;
  subscription: Subscription;
  public oneAtATime = true;
  public isFirstOpen = false;

  constructor(
    private http: HttpClientService,
    private constant: Constants,
    private store: Store<ApplicationState>
  ) {
    this.indicators = [];
    this.CompleteData = [];
    this.dataelements = [];
    this.datasets = [];
    this.events = [];
    this.programInd = [];
    this.dataelementsNumerator = [];
  }

  ngOnInit() {
    // console.log(this.metadataidentifiers);
    const uid = this.metadataidentifiers;
    console.log(this.metadataFromAnalyticsLink(uid));
    this.displayDetail(uid);
  }

  displayDetail(uid) {
    this.showingLoading = true;
    const self = this.http;
    let count = 0;
    const Completeindicators = [];
    this.metadataFromAnalyticsLink(uid).forEach(value => {
      count++;
      this.subscription = this.constant.loadVersion()
        .subscribe(data => {
          const sysytemVersion = data.version;
          const indicatorUrl = 'api/indicators/' + value + '.json?fields=:all,displayName,id,name,' +
            'numeratorDescription,denominatorDescription,denominator,numerator,annualized,decimals,' +
            'indicatorType[name],user[name],attributeValues[value,attribute[name]],indicatorGroups[name,indicators~size],' +
            'legendSet[name,symbolizer,legends~size],dataSets[name]';
          this.subscription = self.get(indicatorUrl)
            .subscribe( indicatorData => {
                // console.log(this.dataElementAvailable(data.numerator));
                const indicatorObject = indicatorData;
                const numeratorExp = self.get('api/expressions/description?expression='
                  + encodeURIComponent(indicatorData.numerator));
                const numeratorDataset = self.get('api/dataElements.json?fields=dataSetElements[dataSet[periodType,id,name,timelyDays,' +
                  'formType,created,expiryDays]],dataSets[periodType,id,name,timelyDays,formType,created,expiryDays]&filter=id:in:[' +
                  this.dataElementAvailable(indicatorData.numerator) + ']&paging=false)');
                const denominatorExp = self.get('api/expressions/description?expression=' +
                  encodeURIComponent(indicatorData.denominator));
                const denominatorDataSet = self.get('api/dataElements.json?fields=dataSetElements[dataSet[periodType,id,name,timelyDays,' +
                  'formType,created,expiryDays]],dataSets[periodType,id,name,timelyDays,formType,created,expiryDays]&filter=id:in:[' +
                  this.dataElementAvailable(indicatorData.denominator) + ']&paging=false)');
                this.subscription = Observable.forkJoin([numeratorExp, numeratorDataset, denominatorExp, denominatorDataSet])
                  .subscribe(results => {
                      const numerator = results[0].description;
                      const numeratorDataEl = results[1];
                      const denominator = results[2].description;
                      const denominatorDataEl = results[3];
                      const selectedIndicator = {
                        object: indicatorObject,
                        numeratorDaset: { dataSets: this.getDataSetsFromDataElements(numeratorDataEl.dataElements)},
                        denominatorDaset: { dataSets: this.getDataSetsFromDataElements(denominatorDataEl.dataElements)},
                        name: indicatorObject.name,
                        uid: indicatorObject.id,
                        numeratorDataElements: this.basicDataElementAvailable(indicatorData.numerator),
                        denominatorDataELements: this.basicDataElementAvailable(indicatorData.denominator),
                        denominatorDescription: indicatorObject.denominatorDescription,
                        numeratorDescription: indicatorObject.numeratorDescription,
                        numerator: numerator,
                        denominator: denominator,
                        indicatorType: indicatorObject.indicatorType,
                        dataSets: indicatorObject.dataSets,
                        numeratorForm: indicatorObject.numerator,
                        demonitorForm: indicatorObject.denominator
                      };
                      Completeindicators.push(selectedIndicator);
                      selectedIndicator['periods']     = this.getMinimumPeriod(selectedIndicator);
                      selectedIndicator['datasetsUid'] = this.getDataSetsUID(selectedIndicator);
                      this.store.dispatch(new SetSelectedIndicatorAction(selectedIndicator));
                      this.CompleteData = Completeindicators;

                    },
                    error => {
                      this.progressMessage = 'Sorry we are still looking what might be wrong';
                    },
                    () => {
                      this.progressMessage = 'Compiling' + data.name + ' for consumptions';
                      if (count === this.metadataFromAnalyticsLink(uid).length) {
                        console.log(count);
                        console.log(this.indicators = this.CompleteData);
                        this.showingLoading = false;
                      }

                    }
                  );
                this.progressMessage = 'Organising extracted metadata dictionary';

              },
              error => {
                this.progressMessage = 'Sorry we are still looking what might be wrong';

              },
              () => {
                this.progressMessage = 'Metadata dictionary ready for consumption';

              }
            );
          this.isIndicator = true;

        });
    });


  }

  getDataSetsUID(indicator) {
    const datasets = [];
    const datasetsUID = [];
    indicator.numeratorDaset.dataSets.forEach( (dataSet) => {
      if (datasets.indexOf(dataSet.id) === -1) {
        datasets.push(dataSet.id);
        datasetsUID.push(dataSet.id + '.REPORTING_RATE');
        datasetsUID.push(dataSet.id + '.REPORTING_RATE_ON_TIME');
      }
    });
    indicator.denominatorDaset.dataSets.forEach( (dataSet) => {
      if (datasets.indexOf(dataSet.id) === -1) {
        datasets.push(dataSet.id);
        datasetsUID.push(dataSet.id + '.REPORTING_RATE');
        datasetsUID.push(dataSet.id + '.REPORTING_RATE_ON_TIME');
      }
    });
    return datasetsUID.join(',');
  }

  getMinimumPeriod(indicator) {
    const periods = [];
    indicator.numeratorDaset.dataSets.forEach( (dataSet) => {
      if (periods.indexOf(dataSet.periodType) === -1) {
        periods.push(dataSet.periodType);
      }
    });
    indicator.denominatorDaset.dataSets.forEach( (dataSet) => {
      if (periods.indexOf(dataSet.periodType) === -1) {
        periods.push(dataSet.periodType);
      }
    });
    return periods;
  }

  getDataSetsFromDataElements( dataElements ) {
    const dataSets = [];
    dataElements.forEach( dataElement => {
      if (dataElement.hasOwnProperty('dataSetElements')) {
        dataElement.dataSetElements.forEach( dataSetElement => {
          if (dataSetElement.hasOwnProperty('dataSet') && !_.find(dataSets, {id: dataSetElement.dataSet.id}) ) {
            dataSets.push(dataSetElement.dataSet);
          }
        });
      }else if (dataElement.hasOwnProperty('dataSets')) {
        dataElement.dataSets.forEach( (dataSet) => {
          if (!_.find(dataSets, {id: dataSet.id}) ) {
            dataSets.push(dataSet);
          }
        });
      }
    });
    return dataSets;
  }

  metadataFromAnalyticsLink(dx) {
    const separatedx = [];
    if (dx.indexOf(';') >= 1) {
      dx.split(';').forEach(data => {
        if (data.indexOf('.') >= 1) {
          if (separatedx.indexOf(data.split('.')[0]) !== -1) {
          } else {
            separatedx.push(data.split('.')[0]);
          }
        } else {
          separatedx.push(data);
        }
      });
    } else {
      if (dx.indexOf('.') >= 1) {
        separatedx.push(dx.split('.')[0]);
      } else {
        separatedx.push(dx);
      }

    }
    return separatedx;

  }

  dataElementAvailable(data) {
    const dataelementuid = [];
    const separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?'];
    const numeratorDataelemnt = data.split(new RegExp(separators.join('|'), 'g'));
    numeratorDataelemnt.forEach(sinngeDa => {
      dataelementuid.push(...this.dataElementWithCatOptionCheck(sinngeDa));
    });
    return dataelementuid.join();

  }

  basicDataElementAvailable(data) {
    const dataelementuid = [];
    const separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?'];
    const numeratorDataelemnt = data.split(new RegExp(separators.join('|'), 'g'));
    numeratorDataelemnt.forEach(sinngeDa => {
      dataelementuid.push(...this.basicDataElementWithCatOptionCheck(sinngeDa));
    });
    return dataelementuid.join();

  }

  dataElementWithCatOptionCheck(dx) {
    const uid = [];
    if (dx.indexOf('.') >= 1) {
      uid.push((dx.replace(/#/g, '').replace(/{/g, '').replace(/}/g, '')).split('.')[0]);
    } else {
      uid.push((dx.replace(/#/g, '').replace(/{/g, '').replace(/}/g, '')));
    }
    return uid;
  }

  basicDataElementWithCatOptionCheck(dx) {
    const uid = [];
    uid.push((dx.replace(/#/g, '').replace(/{/g, '').replace(/}/g, '')));
    return uid;
  }

  private HandleError(error: any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status}-${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.string();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
