import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  selectedItem: string;
  metadataIdentifiers: any;
  metadataIdentifiersArr: any[] = [];
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['selected'] != undefined) {
        if (params['selected'] == 'all' && !params['ids']) {
          this.metadataIdentifiers = [];
          this.selectedItem = params['selected']
          this.router.navigate(['dictionary/all'])
        } else {
          this.selectedItem = params['selected'];
          let identifiers = [];
          params['ids'].split(',').forEach((param) => {
            identifiers.push(param);
          })
          identifiers.push(this.selectedItem);
          this.metadataIdentifiers = _.uniq(identifiers);
          this.router.navigate(['dictionary/' + _.uniq(identifiers).join(',') + '/selected/' + this.selectedItem])
        }
      } else {
        this.metadataIdentifiers = this.metadataIdentifiersArr;
        if (this.metadataIdentifiers.length == 0) {
          this.selectedItem = 'all';
          this.router.navigate(['dictionary/all'])
        } else {
          this.router.navigate(['dictionary/' + _.uniq(this.metadataIdentifiers).join(',') + '/selected/' + this.metadataIdentifiers[0]]);
        }
      }
    })
  }

  dictionaryItemId(listOfItemsObj) {
    if (listOfItemsObj.selected == 'all') {
      this.metadataIdentifiers = listOfItemsObj['otherSelectedIds'];
      if (this.metadataIdentifiers.length > 0) {
        let identifiers = [];
        _.map(this.metadataIdentifiers, (identifier) =>{
          if (identifier != 'all') {
            identifiers.push(identifier)
          }
        })
        this.metadataIdentifiers = identifiers;
        this.router.navigate(['dictionary/' + _.uniq(identifiers).join(',') + '/selected/' + listOfItemsObj.selected])
      } else {
        this.router.navigate(['dictionary/all'])
      }
    } else {
      let identifiers = [];
      listOfItemsObj['otherSelectedIds'].forEach((identifier) => {
        if (identifier != 'all') {
          identifiers.push(identifier);
        }
      })
      if (_.indexOf(identifiers,listOfItemsObj.selected) < 0) {
        identifiers.push(listOfItemsObj.selected)
      }
      this.metadataIdentifiers = _.uniq(identifiers);
      this.router.navigate(['dictionary/' + _.uniq(identifiers).join(',') + '/selected/' + listOfItemsObj.selected])
    }
  }

}
