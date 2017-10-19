import {Component, Input, OnInit} from '@angular/core';
import {ApplicationState} from '../store/application.state';
import {Store} from '@ngrx/store';
import * as selectors from '../store/selectors';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() selectedIndicator: string = null;
  indicator: any = null;
  constructor(private store: Store<ApplicationState>) {
    store.select(selectors.getCurrentSelectedIndicator)
      .subscribe((indicatorData) => {
        this.indicator = indicatorData;
      });
  }

  ngOnInit() {
  }

}
