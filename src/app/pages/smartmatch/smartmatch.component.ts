import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-smartmatch',
  templateUrl: './smartmatch.component.html',
  styleUrls: ['./smartmatch.component.scss']
})
export class SmartmatchComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/matching';
  // Variabili Tabella
  matchs;

  public copy: string;
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Tabella Tutti i Match
    this.httpClient.get(this.ROOT_URL, { headers })
    .toPromise().then((data:any) => {
      // Passo i valori presi da API
      this.matchs = data.matching;
      console.log(this.matchs)
    });




  }
}
