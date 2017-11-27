import { Component, OnInit } from '@angular/core';
import { RetrieveDataService } from '../../searchutils/retrieve-data.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import { MapResultToModelService } from '../../models/map-result-to-model.service';
import { ResultStreamerService } from '../../searchutils/result-streamer.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-searchfield',
  templateUrl: './searchfield.component.html',
  styleUrls: [ './searchfield.component.css' ]
})
export class SearchfieldComponent implements OnInit {

  searchInput: FormControl = new FormControl('');

  constructor(private retrieveData: RetrieveDataService,
              private mrtm: MapResultToModelService,
              private rs: ResultStreamerService) {
    this.searchInput
      .valueChanges
      .filter(x => x.length >= 3)
      .debounceTime(500)
      .switchMap(searchString => retrieveData.getData(searchString))
      .subscribe(
        res => this.rs.pushResultStream(this.mrtm.parseResult(res)),
        err => console.log(`Can't get results. Error code: %s, URL: %s`, err.message, err.url),
        () => console.log('Results retrieved')
      );
  }

  ngOnInit() {
  }

}