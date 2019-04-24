import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as currentUser from './current-user.actions';

import {Observable, of} from 'rxjs';
import {CurrentUserState} from './current-user.state';

import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class CurrentUserEffects {

  constructor(private actions$: Actions) {
  }

}
