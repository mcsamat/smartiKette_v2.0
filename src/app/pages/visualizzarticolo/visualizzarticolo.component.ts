import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-visualizzarticolo',
  templateUrl: './visualizzarticolo.component.html',
  styleUrls: ['./visualizzarticolo.component.css']
})
export class VisualizzarticoloComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api';

  constructor(private httpClient: HttpClient, private router: Router) { }

  // Var
  item_id;
  parametri$: any[] = [];
  valori$: any[] = [];

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('item_id') != null || localStorage.getItem('item_id') != '') {
      this.item_id = localStorage.getItem('item_id');
      this.getDetails();         
    } else {
      this.router.navigate(['../articoli']);
    }
  }

  // Richiesta API dettagli articolo
  getDetails() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(this.ROOT_URL + '/item/concrete/' + this.item_id, { headers })
    .toPromise().then((data:any) => {
      this.parametri$ = Object.keys(data.current_fields);
      this.valori$ = data.current_fields;
    });
  }
    
  // Pulsante Annulla
  goBack(){
    this.router.navigateByUrl('/articoli');
  }

}

