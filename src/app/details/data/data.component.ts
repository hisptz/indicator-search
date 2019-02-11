import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApplicationState} from '../../store/application.state';
import {Store} from '@ngrx/store';
import * as selectors from '../../store/selectors';
import {Http} from '@angular/http';
import {VisualizerService} from "../../services/visualizer.service";
import {PeriodFilterComponent} from "../../shared-components/period-filter/period-filter.component";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  @Input() indicator: any = null;
  visualizationType = 'words';
  periodText: any = null;
  orgUnitText: any = null;
  dataValue: any = null;
  analytics: any = null;
  selected_periods: any = [];
  periodType: any = [];
  orgunitsForAnalytics: any;
  periodForAnalytics: any;
  showIndicator = true;
  showNumerator = false;
  showDenominator = false;
  showDatasets = false;
  loadingdata = true;
  constructor(
    private store: Store<ApplicationState>,
    private http: Http,
    private visualizerService: VisualizerService
  ) {
  }

  ngOnInit() {
    const analyticsUrl = '../../../api/analytics.json?dimension=' +
      'dx:' + this.prepareInitialData() +
      '&dimension=pe:' + this.getInitialPeriod() +
      '&dimension=ou:USER_ORGUNIT&displayProperty=NAME';
    this.http.get(analyticsUrl).map(res => res.json())
      .subscribe( (data) => {
        this.loadingdata = false;
        this.indicator.numeratorTableObject = null;
        this.analytics = data;
        this.orgUnitText = this.getInitialOrgUnitName(this.visualizerService._sanitizeIncomingAnalytics(data));
        this.periodText = this.getInitialPeriodName(this.visualizerService._sanitizeIncomingAnalytics(data));
        this.dataValue = this.getInitialValue(this.visualizerService._sanitizeIncomingAnalytics(data), this.indicator.uid);
        this.periodForAnalytics = {
          name: 'pe',
          items: [
            { id: data.metaData.pe[0],
              name: this.periodText
            }],
          value: data.metaData.pe[0]
        };
        this.selected_periods.push({ id: data.metaData.pe[0], name: this.periodText });
        this.drawTables();
      });
  }

  updateData(period, orgUnit) {
    this.loadingdata = true;
    const analyticsUrl = '../../../api/analytics.json?dimension=' +
      'dx:' + this.prepareInitialData() +
      '&dimension=pe:' + period.value +
      '&dimension=ou:' + orgUnit.value + '&displayProperty=NAME';
    this.http.get(analyticsUrl).map(res => res.json())
      .subscribe( (data) => {
        this.indicator.numeratorTableObject = null;
        this.analytics = data;
        this.orgUnitText = orgUnit.starting_name + ' ' + orgUnit.items.map((ou) => ou.name).join(', ');
        this.periodText = this.periodText = period.items.map((ou) => ou.name).join(', ');
        this.dataValue = this.getInitialValue(this.visualizerService._sanitizeIncomingAnalytics(data), this.indicator.uid);
        this.drawTables();
        this.loadingdata = false;
      });
  }

  drawTables() {
    const indicatorAnalytics = {...this.analytics};
    indicatorAnalytics.metaData.dx = [this.indicator.uid];
    const tableConfiguration = {
      title: this.indicator.name,
      rows: ['ou'],
      columns: ['dx', 'pe'],
      displayList: false,
    };
    this.indicator.tableObject = this.visualizerService.drawTable(indicatorAnalytics, tableConfiguration);
    // Numerator table
    const numeratorAnalytics = {...this.analytics, metaData: {...this.analytics.metaData, dx: this.getNumeratorDataElements()}};
    const numeratorTableConfiguration = {...tableConfiguration, title: 'Numerator'};
    this.indicator.numeratorTableObject = this.visualizerService.drawTable(numeratorAnalytics, numeratorTableConfiguration);
    // denominator table
    if ( this.getDenominatorDataElements().length !== 0) {
      const denominatorAnalytics = {...this.analytics, metaData: {...this.analytics.metaData, dx: this.getDenominatorDataElements()}};
      const denominatorTableConfiguration = {...tableConfiguration, title: 'Denominator'};
      this.indicator.numeratorTableObject = this.visualizerService.drawTable(denominatorAnalytics, denominatorTableConfiguration);
    }
    // DataSets table
    if ( this.getDataSets().length !== 0) {
      const datasetAnalytics = {...this.analytics, metaData: {...this.analytics.metaData, dx: this.getDataSets()}};
      const datasetTableConfiguration = {...tableConfiguration, title: 'Completeness'};
      this.indicator.dataSetTableObject = this.visualizerService.drawTable(datasetAnalytics, datasetTableConfiguration);
    }
  }

  getInitialPeriod(): string {
    switch (this.indicator.periods[0])  {
      case 'Monthly': {
       return 'LAST_MONTH';
      }
      case 'Quarterly': {
       return 'LAST_QUARTER';
      }
      case 'Yearly': {
       return 'LAST_YEAR';
      }
      case 'Weekly': {
       return 'LAST_WEEK';
      }
      case 'Daily': {
       return 'LAST_WEEK';
      }
      default: {
        return 'LAST_QUARTER';
      }
    }
  }

  prepareInitialData() {
    const data = [];
    data.push(this.indicator.uid);
    this.indicator.numeratorDataElements.split(',').forEach( (item) => {
      if (item.length >= 11) {
        data.push(item);
      }
    });
    console.log(this.indicator.numeratorDataElements);
    this.indicator.denominatorDataELements.split(',').forEach( (item) => {
      if (item.length >= 11) {
        data.push(item);
      }
    });
    this.indicator.datasetsUid.split(',').forEach( (item) => {
      data.push(item);
    });
    return data.join(';');
  }

  getNumeratorDataElements() {
    const data = [];
    this.indicator.numeratorDataElements.split(',').forEach( (item) => {
      if (item.length >= 11) {
        data.push(item);
      }
    });
    return data;
  }

  getDenominatorDataElements() {
    const data = [];
    this.indicator.denominatorDataELements.split(',').forEach( (item) => {
      if (item.length >= 11) {
        data.push(item);
      }
    });
    return data;
  }

  getDataSets() {
    const data = [];
    this.indicator.datasetsUid.split(',').forEach( (item) => {
      data.push(item);
    });
    return data;
  }

  changeVisualizationType(type) {
    this.visualizationType = type;
  }

  getInitialOrgUnitName(analytics) {
    this.orgunitsForAnalytics = {
      name: 'ou',
      value: analytics.metaData.ou[0],
      items: [ {
        id: analytics.metaData.ou[0],
        name: analytics.metaData.names[analytics.metaData.ou[0]]
      }]
    };
    return analytics.metaData.names[analytics.metaData.ou[0]];
  }

  getInitialPeriodName(analytics) {
    return analytics.metaData.names[analytics.metaData.pe[0]];
  }

  getInitialValue( analytics, dataItem ) {
    return this.visualizerService.getDataValue( analytics, [{'type': 'dx', 'value': dataItem}] ) || 0;
  }

  getListItems(items, analytics, name?) {
    const data = [];
    if (name === 'datasets') {
      items.split(',').forEach( (item) => {
        data.push(
          {
            id: item,
            name: analytics.metaData.names[item],
            value: this.visualizerService.getDataValue( analytics, [{'type': 'dx', 'value': item}] ) || 0}
        );
      });
    }else {
      if (items.length === 1 && !isNaN(items)) {
        data.push({id: '', name: name, value: items[0]});
      }else {
        items.split(',').forEach( (item) => {
          if (item.length >= 11) {
            data.push(
              {
                id: item,
                name: analytics.metaData.names[item],
                value: this.visualizerService.getDataValue( analytics, [{'type': 'dx', 'value': item}] ) || 0}
            );
          }
        });
      }
    }


    return data;
  }

  updateOrgUnit(event) {
    this.orgunitsForAnalytics = event;
    this.updateData(this.periodForAnalytics, this.orgunitsForAnalytics);
  }

  changeOrgUnit(event) {
    this.orgunitsForAnalytics = event;
  }

  changePeriod(event) {
    this.periodForAnalytics = event;
  }

  updatePeriod(event) {
    this.periodForAnalytics = event;
    this.selected_periods = event.items;
    this.updateData(this.periodForAnalytics, this.orgunitsForAnalytics);
  }
}
