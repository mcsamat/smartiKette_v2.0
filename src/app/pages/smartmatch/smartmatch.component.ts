import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-smartmatch',
  templateUrl: './smartmatch.component.html',
  styleUrls: ['./smartmatch.component.scss']
})
export class SmartmatchComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/matching';
  
  // DT var
  matchs$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    // Richiesta GET
    this.httpClient.get(this.ROOT_URL + '?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.matchs$ = data.matching;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
