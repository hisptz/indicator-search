import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trend-analysis',
  templateUrl: './trend-analysis.component.html',
  styleUrls: ['./trend-analysis.component.css']
})
export class TrendAnalysisComponent implements OnInit {

  @Input() indicator: any;
  @Input() currentUser: any;
  selectedOrganisationUnit: string;
  constructor() { }

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
