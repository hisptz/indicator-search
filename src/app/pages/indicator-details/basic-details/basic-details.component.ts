import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {

  @Input() indicator: any;
  constructor() { }

  ngOnInit() {
  }

}
