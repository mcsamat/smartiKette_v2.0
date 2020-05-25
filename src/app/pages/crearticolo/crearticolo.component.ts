import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-crearticolo',
  templateUrl: './crearticolo.component.html',
  styleUrls: ['./crearticolo.component.css']
})
export class CrearticoloComponent implements OnInit {
  // Var
  item_id;
  parametri$: any[] = [];
  valori$: any[] = [];

  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('item_id') != null || localStorage.getItem('item_id') != '') {
      this.item_id = localStorage.getItem('item_id');
      this.getDetails();         
    } else {
      this.router.navigate(['../articoli']);
    }
  }

  // Richiesta API campi articolo
  getDetails() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/item/concrete/' + this.item_id, { headers })
    .toPromise().then((data:any) => {
      // this.currentFields$ = data.current_fields;
      this.parametri$ = Object.keys(data.current_fields);
      this.valori$ = data.current_fields;
      // console.log(this.parametri$);
    }, error =>{
      console.log(error);
    });
  }

}
