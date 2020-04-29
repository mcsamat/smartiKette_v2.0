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
  locations$;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.getLocations();
  }

  // Metodo GET - Visualizzare Locations
  getLocations() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Elenco Corsie
    this.httpClient.get(this.ROOT_URL, { headers })
    .toPromise().then((corsieAPI:any) => {
      // Passo i valori presi da API
      this.locations$ = corsieAPI.locations;
      // console.log(this.corsie$[0].location_type.id)
    });
  }

  // Metodo POST - Aggiungere Location
  postCorsia(nomeLocation: string, tipoLocation: string) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    console.log(localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Params
    let params = new HttpParams()
    .set('locationTypeId', tipoLocation)
    .set('locationName', nomeLocation)
    .set('isActive', 'true');
    
    // Aggiungo Location
    this.httpClient.post(this.ROOT_URL, params, { headers }).subscribe();

    // Aspetto 100ms e richiedo i nuovi dati
    setTimeout(()=>{
      this.getLocations();
    }, 100);
  }


}
