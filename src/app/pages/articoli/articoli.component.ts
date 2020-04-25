import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

var items_tot: number;

@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.scss']
})
export class ArticoliComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/item';

  // DT var
  items$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Trovo il numero totale di items
    this.httpClient.get(this.ROOT_URL + '/concrete', { headers })
    .toPromise().then((data:any) => {
      items_tot = data.total_items;
    });

    // DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.httpClient.get(this.ROOT_URL + '/concrete?recordsPerPage=999999999999' + items_tot, { headers })
    .toPromise().then((data:any) => {
      // Passo i valori presi da API
      this.items$ = data.items;
      this.dtTrigger.next();
      console.log(items_tot)
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
