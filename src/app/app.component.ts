import { Component } from '@angular/core';

import {Store} from '@ngrx/store';
import * as currentUser from './store/current-user/current-user.actions';
import * as indicators from './store/indicators/indicators.actions';
import { AppState } from './store/app.reducers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'indicator-dictionary';

  constructor(private store: Store<AppState>, private router: Router){
    store.dispatch(new currentUser.LoadAction);
    // dictionary/:format/:ids?/:option?/:selected?
    this.router.navigate(['/dictionary/allIndicators'])
  }
}
