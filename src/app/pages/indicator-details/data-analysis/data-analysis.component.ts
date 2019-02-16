import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {

  @Input() indicator: any;
  constructor() { }

  ngOnInit() {
  }

}
