import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.scss']
})
export class ArticoliComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/item';
  // Variabili Item Concrete
  items_tot: number;
  items;


  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Tabella Tutti gli Articoli
    this.httpClient.get(this.ROOT_URL + '/concrete', { headers })
    .toPromise().then((data:any) => {
      // Passo i valori presi da API
      this.items_tot = data.total_items;
      this.items = data.items;
    });


  }
}
