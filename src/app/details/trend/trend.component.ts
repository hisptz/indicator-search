import {Component, Input, OnInit} from '@angular/core';
import {VisualizerService} from '../../services/visualizer.service';
import {Http} from '@angular/http';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application.state';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css']
})
export class TrendComponent implements OnInit {

  @Input() indicator: any = null;
  loadingdata = true;
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
  visualizationType = 'chart';
  tableObject: any = null;
  chartObject: any = null;
  constructor(
    private store: Store<ApplicationState>,
    private http: Http,
    private visualizerService: VisualizerService
  ) { }

  ngOnInit() {
    const analyticsUrl = '../../../api/analytics.json?dimension=' +
      'dx:' + this.indicator.uid +
      '&dimension=pe:' + this.getInitialPeriod() +
      '&dimension=ou:USER_ORGUNIT&displayProperty=NAME';
    this.http.get(analyticsUrl).map(res => res.json())
      .subscribe( (data) => {
        this.loadingdata = false;
        this.indicator.numeratorTableObject = null;
        this.analytics = data;
        this.orgUnitText = this.getInitialOrgUnitName(this.visualizerService._sanitizeIncomingAnalytics(data));
        this.drawTables();
      });
  }

  updateData(period, orgUnit) {
    this.loadingdata = true;
    const analyticsUrl = '../../../api/analytics.json?dimension=' +
      'dx:' + this.indicator.uid +
      '&dimension=pe:' + this.periodType +
      '&dimension=ou:' + orgUnit.value + '&displayProperty=NAME';
    this.http.get(analyticsUrl).map(res => res.json())
      .subscribe( (data) => {
        this.indicator.numeratorTableObject = null;
        this.analytics = data;
        this.orgUnitText = orgUnit.starting_name + ' ' + orgUnit.items.map((ou) => ou.name).join(', ');
        this.drawTables();
        this.loadingdata = false;
      });
  }

  drawTables() {
    const indicatorAnalytics = {...this.analytics};
    indicatorAnalytics.metaData.dx = [this.indicator.uid];
    const chartConfiguration = {
      type: 'line',
      title: this.indicator.name + ' ' + this.orgUnitText,
      xAxisType: 'pe',
      yAxisType: 'dx',
      show_labels: false
    };
    this.chartObject = this.visualizerService.drawChart(indicatorAnalytics, chartConfiguration);
    const tableConfiguration = {
      title: this.indicator.name,
      rows: ['ou'],
      columns: ['dx', 'pe'],
      displayList: false,
    };
    this.tableObject = this.visualizerService.drawTable(indicatorAnalytics, tableConfiguration);
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
        this.periodType = 'LAST_12_MONTHS';
        return 'LAST_12_MONTHS';
      }
      case 'Quarterly': {
        this.periodType = 'LAST_4_QUARTERS';
        return 'LAST_4_QUARTERS';
      }
      case 'Yearly': {
        this.periodType = 'LAST_5_YEARS';
        return 'LAST_5_YEARS';
      }
      case 'Weekly': {
        this.periodType = 'LAST_12_MONTHS';
        return 'LAST_12_MONTHS';
      }
      case 'Daily': {
        this.periodType = 'LAST_12_MONTHS';
        return 'LAST_12_MONTHS';
      }
      default: {
        this.periodType = 'LAST_4_QUARTERS';
        return 'LAST_4_QUARTERS';
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
    this.updateData(this.periodType, this.orgunitsForAnalytics);
  }

  changeOrgUnit(event) {
    this.orgunitsForAnalytics = event;
  }

  updatePeriod(event) {
    this.periodType = event;
    this.updateData(this.periodType, this.orgunitsForAnalytics);
  }
}
