import { Component, OnInit } from '@angular/core';
import { IndicatorSearchService } from 'src/app/services/indicator-search.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';
import { CurrentUserState } from 'src/app/store/current-user/current-user.state';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getCurrentUser } from '../../store/current-user/current-user.selectors';
import { IndicatorsState, AllIndicatorsState, IndicatorGroupsState } from 'src/app/store/indicators/indicators.state';
import { getListOfIndicators, getallIndicators, getProgressLoaderInfo, getIndicatorGroups } from '../../store/indicators/indicators.selectors';
import { ActivatedRoute, Params } from '@angular/router';

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
export class HomeComponent implements OnInit {

  error: boolean;
  loading: boolean;
  searchingText: string;
  searchingTextForIndicatorGroup: string;
  hoverState = 'notHovered';
  completedPercent = 0;
  selectedIndicator: any = null;
  totalAvailableIndicators: any = null;
  loadedIndicatorsCount = 0;
  showIndicatorGroups = false;
  currentPage: number = 1;
  indicators: any[] = [];
  groupToFilter: any[] = [];
  currentUser$: Observable<CurrentUserState>;
  indicatorsList$: Observable<IndicatorsState>;
  allIndicators$: Observable<AllIndicatorsState>;
  progressBarInfo$: Observable<any>;
  indicatorGroups$: Observable<IndicatorGroupsState>;
  indicatorGroups: any[] = [];
  indicatorGroupsForSearching = [];
  metadataIdentifiers: any[] = [''];

  constructor(private indicatorSearchService: IndicatorSearchService, private store: Store<AppState>, private route: ActivatedRoute) {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.indicatorsList$ = this.store.select(getListOfIndicators);
    this.allIndicators$ = this.store.select(getallIndicators);
    this.progressBarInfo$ = this.store.pipe(select(getProgressLoaderInfo));
    this.indicatorGroups$ = this.store.pipe(select(getIndicatorGroups));

    this.searchingText = '';
    this.searchingTextForIndicatorGroup = '';
    this.indicators = [];
    this.loading = true;
    this.error =false;
   }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.log(params)
    })
  }

}
