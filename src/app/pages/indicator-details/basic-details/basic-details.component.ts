import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-client.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import * as _ from 'lodash';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {

  @Input() indicator: any;
  metadataArray = [];
  // api/expressions/description?expression
  constructor(private httpClient: HttpClientService, private store: Store<AppState>) { }

  ngOnInit() {
    this.metadataArray.push(this.indicator.id);
  }

}
