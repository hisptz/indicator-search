import { Component, OnInit } from '@angular/core';
import { IndicatorSearchService } from 'src/app/services/indicator-search.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';
import { CurrentUserState } from 'src/app/store/current-user/current-user.state';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getCurrentUser } from '../../store/current-user/current-user.selectors';
import { IndicatorsState } from 'src/app/store/indicators/indicators.state';
import * as indicators from '../../store/indicators/indicators.actions';
import { getListOfIndicators } from '../../store/indicators/indicators.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
        '-webkit-box-shadow': '0 0 0 rgba(0,0,0,0.2)',
        'box-shadow': '0 0 0 rgba(0,0,0,0.2)',
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
        '-webkit-box-shadow': '0 0 0 rgba(0,0,0,0.2)',
        'box-shadow': '0 0 0 rgba(0,0,0,0.2)',
        'background-color': 'rgba(0,0,0,0.03)',
        'border': '1px solid #ddd'
      })),
      transition('notHovered <=> hoovered', animate('400ms'))
    ])

  ]

})
export class HomeComponent implements OnInit {

  error: boolean;
  loading: boolean;
  searchingText: string;
  hoverState = 'notHovered';
  completedPercent = 0;
  selectedIndicator: any = null;
  totalAvailableIndicators: any = null;
  loadedIndicatorsCount = 0;
  hideGroups = true;
  currentPage: number = 1;
  indicators: any[] = [];
  groupToFilter: any[] = [];
  indicatorGroups: any[] = [];
  currentUser$: Observable<CurrentUserState>;
  indicatorsList$: Observable<IndicatorsState>;
  constructor(private indicatorSearchService: IndicatorSearchService, private store: Store<AppState>) {
    this.store.dispatch(new indicators.LoadIndicatorsAction())
    this.currentUser$ = this.store.select(getCurrentUser);
    this.indicatorsList$ = this.store.select(getListOfIndicators);

    this.searchingText = '';
    this.indicators = [];
    this.loading = true;
    this.error =false;
   }

  ngOnInit() {
    if (this.currentUser$ && this.indicatorsList$) {
      this.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          console.log(currentUser);
          this.indicatorsList$.subscribe((indicatorList) => {
            if (indicatorList) {
              console.log(indicatorList)
            }
          })
          this.loadIndicatorsByPage(1);
        }
      })
    }
  }

  loadIndicatorsByPage(pageNo) {
    this.indicatorSearchService.loadIndicatorsByPage(pageNo)
    .subscribe((indicatorsLoaded) => {
      this.totalAvailableIndicators = indicatorsLoaded['pager']['total'];
        this.loadedIndicatorsCount += indicatorsLoaded['pager']['pageSize'];
        this.completedPercent = 100 * (indicatorsLoaded['pager']['page'] / indicatorsLoaded['pager']['pageCount']);
        this.indicators = [...this.indicators, ...indicatorsLoaded['indicators']];
        // this.store.dispatch(new SetIndicatorsAction(result.indicators));
        if (indicatorsLoaded['pager'].hasOwnProperty('nextPage')) {
          this.loadIndicatorsByPage(pageNo + 1);
        }
        if (this.completedPercent === 100 ) {
          this.loading = false;
          this.error = false;
        }
    }, (error) => {
      this.error = true;
      this.loading = false;
    })
  }

  mouseEnter(indicator) {
    this.selectedIndicator = indicator.id;
    this.hoverState = 'hoovered';
  }

  mouseLeave() {
    // this.store.dispatch(new SetSelectedIndicatorAction(null));
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
