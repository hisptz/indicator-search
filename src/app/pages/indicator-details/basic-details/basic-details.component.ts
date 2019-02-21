import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-client.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {

  @Input() indicator: any;
  constructor(private httpClient: HttpClientService) { }

  ngOnInit() {
    if (this.indicator) {
      console.log(this.indicator)
    }
  }

}
