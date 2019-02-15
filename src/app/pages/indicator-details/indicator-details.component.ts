import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-indicator-details',
  templateUrl: './indicator-details.component.html',
  styleUrls: ['./indicator-details.component.css']
})
export class IndicatorDetailsComponent implements OnInit {

  @Input() allIndicators: any;
  constructor() { }

  ngOnInit() {
    if (this.allIndicators.indicators) {
      console.log('this', this.allIndicators);
    }
  }

}
