import {Component, OnInit} from '@angular/core';
import {ApplicationState} from './store/application.state';
import {Store} from '@ngrx/store';
import {IndicatorGroupService} from './services/indicator-group.service';
import {Observable} from 'rxjs/Observable';
import * as selectors from './store/selectors';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SetIndicatorsAction, SetSelectedIndicatorAction} from './store/actions/store.data.action';
import {PaginationInstance} from 'ngx-pagination';

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
    ])

  ]
})
export class AppComponent implements OnInit {

  loading = true;
  error = false;
  completePercent = 0;
  indicators: any[] = [];
  config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 4,
    currentPage: 1
  };
  queryterm = '';
  hoverState = 'notHovered';
  selectedIndicator: any = null;
  constructor(
    private store: Store<ApplicationState>,
    private indicatorService: IndicatorGroupService
  ) {
    this.indicators = [];
  }

  ngOnInit() {
    this.loadIndicators(1);
    console.log('finding details');
  }

  loadIndicators(page) {
    this.indicatorService.loadIndicators(page)
      .subscribe( (result) => {
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
}
