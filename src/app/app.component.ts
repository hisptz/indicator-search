import { Component } from '@angular/core';

import {Store} from '@ngrx/store';
import * as currentUser from './store/current-user/current-user.actions';
import { AppState } from './store/app.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'indicator-dictionary';

  constructor(private store: Store<AppState>){
    store.dispatch(new currentUser.LoadAction)
  }
}
