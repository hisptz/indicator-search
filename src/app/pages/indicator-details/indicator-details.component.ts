import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AllIndicatorsState } from 'src/app/store/indicators/indicators.state';
import { AppState } from 'src/app/store/app.reducers';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { ActivatedRoute, Params } from '@angular/router';
import { getallIndicators } from 'src/app/store/indicators/indicators.selectors';
import { HttpClientService } from 'src/app/services/http-client.service';
import { CurrentUserState } from 'src/app/store/current-user/current-user.state';
import { getCurrentUser } from 'src/app/store/current-user/current-user.selectors';

@Component({
  selector: 'app-indicator-details',
  templateUrl: './indicator-details.component.html',
  styleUrls: ['./indicator-details.component.css']
})
export class IndicatorDetailsComponent implements OnInit {

  selectedIndicator: any;
  allIndicators: any[] = [];
  allIndicators$: Observable<AllIndicatorsState>;
  typeOfAction: string;
  currentUser$: Observable<CurrentUserState>;
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private httpClient: HttpClientService) {
    this.allIndicators$ = store.select(getallIndicators);
    this.currentUser$ = store.select(getCurrentUser)
   }

  ngOnInit() {
    if (this.allIndicators$) {
      this.allIndicators$.subscribe((indicatorsLoaded) => {
        if (indicatorsLoaded) {
          this.allIndicators = [];
          _.map(indicatorsLoaded, (indicatorsByPage) => {
            this.allIndicators = [...this.allIndicators, ...indicatorsByPage['indicators']];
          });
          if (this.allIndicators.length > 0) {
            _.map(this.allIndicators, (indicator: any) => {
              this.route.params.forEach((params: Params) => {
                if (indicator.id ==params['id']) {
                  this.typeOfAction = params['type-of-action'];
                  this.selectedIndicator = indicator;
                }
              })
            })
          }
        }
      })
    }
  }

}
