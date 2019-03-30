import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.css'],
  animations: [
    trigger('open', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0
        }),
      ])
    ])
  ]
})
export class FilterSectionComponent implements OnInit {

  @Input() selectedOrganisationUnit: any;
  @Output() organisationsDefinition: EventEmitter<any> = new EventEmitter<any>();
  @Output() showOrgUnitFilterTree: EventEmitter<any> = new EventEmitter<any>();
  orgUnitsDefinition: any;
  orgUnitModel$: any;
  showOrgUnitFilter: boolean;
  selectedFilter: '';
  constructor(private router: Router) {
    this.showOrgUnitFilter = false;
  }

  ngOnInit() {
    this.orgUnitModel$ = new Observable((observer) => {
      observer.next({
        'selectionMode': 'Level',
        'selectedLevels': [],
        'showUpdateButton': true,
        'selectedGroups': [],
        'orgUnitLevels': [],
        'orgUnitGroups': [],
        'selectedOrgUnits': [
          {
            'id': this.selectedOrganisationUnit['id'],
            'name': ''
          }
        ],
        'userOrgUnits': [],
        'type': 'report',
        'selectedUserOrgUnits': []
      });
    });
  }

  

  onFilterUpdateAction(actionDefn, typeOfFilter) {
    if (typeOfFilter == 'ORG_UNIT') {
      this.showOrgUnitFilter = false;
      this.orgUnitsDefinition = actionDefn;
      this.organisationsDefinition.emit(actionDefn);
    } else {
      console.log(actionDefn)
    }
  }

}
