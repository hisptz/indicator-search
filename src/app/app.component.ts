import {Component, OnInit} from '@angular/core';
import {ApplicationState} from './store/application.state';
import {Store} from '@ngrx/store';
import {IndicatorGroupService} from './services/indicator-group.service';
import {Observable} from 'rxjs/Observable';
import * as selectors from './store/selectors';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SetIndicatorsAction, SetSelectedIndicatorAction} from './store/actions/store.data.action';
import {PaginationInstance} from 'ngx-pagination';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('notHovered' , style({
        'transform': 'scale(0, 0)',
        'position': 'absolute',
        'top': '100px',
        'box-shadow': '0 0 0px rgba(0,0,0,0.0)',
        'background-color': 'rgba(0,0,0,0.0)',
        'border': '0px solid #ddd'
      })),
      state('hoovered', style({
        'min-height': '500px',
        'width': '80%',
        'left': '10%',
        'position': 'absolute',
        'top': '100px',
        'bottom': '50px',
        'z-index': '100',
        '-webkit-box-shadow': '0 0 10px rgba(0,0,0,0.2)',
        'box-shadow': '0 0 10px rgba(0,0,0,0.2)',
        'background-color': 'rgba(255,255,255,1)',
        'border': '1px solid #ddd'
      })),
      transition('notHovered <=> hoovered', animate('600ms'))
    ]),
    trigger('hiddenItem', [
      state('notHidden' , style({
        'transform': 'scale(1, 1)'
      })),
      state('hidden', style({
        'transform': 'scale(0.0, 0.00)',
        'visibility': 'hidden',
        'height': '0px'
      })),
      transition('notHidden <=> hidden', animate('1000ms'))
    ]),
    trigger('hoverChanged', [
      state('notHovered' , style({
        'transform': 'scale(1, 1)',
        '-webkit-box-shadow': '0 0 0px rgba(0,0,0,0.1)',
        'box-shadow': '0 0 0px rgba(0,0,0,0.2)',
        'background-color': 'rgba(0,0,0,0.0)',
        'border': '0px solid #ddd'
      })),
      state('hoovered', style({
        'transform': 'scale(1.04, 1.04)',
        '-webkit-box-shadow': '0 0 10px rgba(0,0,0,0.2)',
        'box-shadow': '0 0 10px rgba(0,0,0,0.2)',
        'background-color': 'rgba(0,0,0,0.03)',
        'border': '1px solid #ddd'
      })),
      transition('notHovered <=> hoovered', animate('400ms'))
    ])

  ]
})
export class AppComponent implements OnInit {

  loading = true;
  error = false;
  completePercent = 0;
  indicators: any[] = [];
  indicatorGroups: any[] = [];
  config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 4,
    currentPage: 1
  };
  queryterm = '';
  hoverState = 'notHovered';
  selectedIndicator: any = null;
  totalIndicators: any = null;
  loadedIndicators = 0;
  hideGroups = true;
  groupToFilter: any[] = [];
  constructor(
    private store: Store<ApplicationState>,
    private indicatorService: IndicatorGroupService
  ) {
    this.indicators = [];
  }

  ngOnInit() {
    this.loadIndicators(1);
    this.indicatorService.loadAllGroups()
      .subscribe( groups => {
        this.indicatorGroups = groups.indicatorGroups;
      });
  }

  loadIndicators(page) {
    this.indicatorService.loadIndicators(page)
      .subscribe( (result) => {
        this.totalIndicators = result.pager.total;
        this.loadedIndicators += result.pager.pageSize;
        this.completePercent = 100 * (result.pager.page / result.pager.pageCount);
        this.indicators = [...this.indicators, ...result.indicators];
        // this.store.dispatch(new SetIndicatorsAction(result.indicators));
        if (result.pager.hasOwnProperty('nextPage')) {
          this.loadIndicators(page + 1);
        }
        if (this.completePercent === 100 ) {
          this.loading = false;
          this.error = false;
        }
      }, (error) => {
        this.error = true;
        this.loading = false;
      });
  }

  mouseEnter(indicator) {
    this.selectedIndicator = indicator.id;
    this.hoverState = 'hoovered';
  }

  mouseLeave() {
    this.store.dispatch(new SetSelectedIndicatorAction(null));
    this.selectedIndicator = null;
    this.hoverState = 'notHovered';
  }


  displayPerTree() {
    this.hideGroups = !this.hideGroups;
  }

  addGroupFilter(group) {
    if (this.inGroupToFilter(group.id)) {
      this.groupToFilter.splice(_.findIndex(this.groupToFilter, {id: group.id}), 1);
    }else {
      this.groupToFilter.push(group);
    }
    this.indicators = [...this.indicators];
  }

  inGroupToFilter(id) {
    return _.find(this.groupToFilter, {id: id});
  }

  groupNames() {
    if ( this.groupToFilter.length < 5 ) {
      return this.groupToFilter.map( g => g.name ).join(', ');
    }else {
      const diff = this.groupToFilter.length - 4;
      return this.groupToFilter.slice(0, 4).map( g => g.name ).join(', ') + ' and ' + diff + ' More';
    }
  }
}
