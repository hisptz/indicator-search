import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IndicatorGroupsState } from 'src/app/store/indicators/indicators.state';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { getIndicatorGroups } from 'src/app/store/indicators/indicators.selectors';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-indicator-groups',
  templateUrl: './indicator-groups.component.html',
  styleUrls: ['./indicator-groups.component.css']
})
export class IndicatorGroupsComponent implements OnInit {

  indicatorGroup: any;
  indicatorGroups$: Observable<IndicatorGroupsState>
  constructor(private store: Store<AppState>, private route: ActivatedRoute) { 
    this.indicatorGroups$ = this.store.pipe(select(getIndicatorGroups));
  }

  ngOnInit() {
    if (this.indicatorGroups$) {
      this.indicatorGroups$.subscribe((indicatorGroup) => {
        if (indicatorGroup) {
          this.route.params.forEach((params: Params) => {
            _.map(indicatorGroup['indicatorGroups'], (group: any) => {
              if (group.id == params['id']) {
                this.indicatorGroup = group;
              }
            })
          })
        }
      })
    }
  }

}
