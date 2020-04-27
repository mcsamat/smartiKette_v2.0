import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/location';
  // Variabili Location
  corsie$;
  posizioni;
  ripiano;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Elenco Corsie
    this.httpClient.get(this.ROOT_URL, { headers })
    .toPromise().then((corsieAPI:any) => {
      // Passo i valori presi da API
        this.corsie$ = corsieAPI.locations;
        // console.log(this.corsie$[0].location_type.id)
    });
  }

}
