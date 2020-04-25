import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { AppModule } from '../../app.module'; 
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';


@Component({
  selector: 'app-etichette',
  templateUrl: './etichette.component.html',
  styleUrls: ['./etichette.component.scss']
})
export class EtichetteComponent implements OnInit, OnDestroy {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api';

  // DT var
  labels$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // DataTables First Test
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.httpClient.get(this.ROOT_URL + '/labelinfo', { headers })
    .toPromise().then((data:any) => {
      // Passo i valori presi da API
      this.labels$ = data.label_info;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
