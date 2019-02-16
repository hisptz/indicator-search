import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trend-analysis',
  templateUrl: './trend-analysis.component.html',
  styleUrls: ['./trend-analysis.component.css']
})
export class TrendAnalysisComponent implements OnInit {

  @Input() indicator: any;
  constructor() { }

  ngOnInit() {
  }

}
