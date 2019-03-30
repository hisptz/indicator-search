import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {

  @Input() indicator: any;
  @Input() currentUser: any;
  selectedOrganisationUnit: string;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    if (this.currentUser) {
      console.log(this.currentUser);
      this.selectedOrganisationUnit = this.currentUser.organisationUnits[0];
    }
  }

  organisationsDefinition(e){
    console.log('e', e);
  }
}
