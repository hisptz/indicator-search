import { Component, OnInit } from '@angular/core';
import { IndicatorSearchService } from 'src/app/services/indicator-search.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';
import { CurrentUserState } from 'src/app/store/current-user/current-user.state';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getCurrentUser } from '../../store/current-user/current-user.selectors';
import { IndicatorsState, AllIndicatorsState } from 'src/app/store/indicators/indicators.state';
import { getListOfIndicators, getallIndicators, getProgressLoaderInfo } from '../../store/indicators/indicators.selectors';

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
  allIndicators$: Observable<AllIndicatorsState>;
  progressBarInfo$: Observable<any>;
  constructor(private indicatorSearchService: IndicatorSearchService, private store: Store<AppState>) {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.indicatorsList$ = this.store.select(getListOfIndicators);
    this.allIndicators$ = this.store.select(getallIndicators);
    this.progressBarInfo$ = this.store.pipe(select(getProgressLoaderInfo));

    this.searchingText = '';
    this.indicators = [];
    this.loading = true;
    this.error =false;
   }

  ngOnInit() {
    if (this.currentUser$ && this.indicatorsList$) {
      this.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          this.indicatorsList$.subscribe((indicatorList) => {
            if (indicatorList) {
              this.totalAvailableIndicators = indicatorList['pager']['total']
              if (this.allIndicators$) {
                this.allIndicators$.subscribe((indicatorsLoaded) => {
                  if (indicatorsLoaded) {
                    this.indicators = [];
                    _.map(indicatorsLoaded, (indicatorsByPage) => {
                      this.indicators = [...this.indicators, ...indicatorsByPage['indicators']];
                      this.completedPercent = 100 * (this.indicators.length / this.totalAvailableIndicators);
                      if (this.completedPercent === 100 ) {
                        this.loading = false;
                        this.error = false;
                      }
                    })
                  }
                })
              }
            }
          })
        }
      })
    }

    if (this.progressBarInfo$) {
      this.progressBarInfo$.subscribe((progressBarInfo) => {
        if (progressBarInfo) {
          console.log(progressBarInfo);
        }
      })
    }
  }


  mouseEnter(indicator) {
    this.selectedIndicator = indicator.id;
    this.hoverState = 'hoovered';
  }

  mouseLeave() {
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
