import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-visualizzarticolo',
  templateUrl: './visualizzarticolo.component.html',
  styleUrls: ['./visualizzarticolo.component.css']
})
export class VisualizzarticoloComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) { }

  //form
  editItem;

  // Var
  item_id;
  parametri$: any[] = [];
  valori$: any[] = [];

  matchs$ = [];

  // Preview
  prevA;
  prev: string = '';
  showPrev: boolean = false;

  // Update
  currentFields$;

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('item_id') != null || localStorage.getItem('item_id') != '') {
      this.item_id = localStorage.getItem('item_id');
      this.getDetails();
      this.getMatch();         
    } else {
      this.router.navigate(['../articoli']);
    }
  }

  // Richiesta API dettagli articolo
  getDetails() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/item/concrete/' + this.item_id, { headers })
    .toPromise().then((data:any) => {
      this.currentFields$ = data.current_fields;
      this.parametri$ = Object.keys(data.current_fields);
      this.valori$ = data.current_fields;
      // console.log(this.valori$);
    }, error =>{
      console.log(error);
    });
  }

  // API GET  matching
  getMatch() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/matching/item/' + this.item_id, { headers })
    .toPromise().then((data:any) => {
      let temp_data = data.matching;
      this.matchs$ = temp_data;
      // console.log(this.matchs$)
    }, error =>{
      console.log(error);
    });
  }
  // Preview 
  openPreview(id) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Richiesta preview
    this.httpClient.get(environment.URL_ROOT + '/matching/preview/' + id, { headers, responseType: 'text'  }).subscribe(data =>{
      this.prev = data;
      this.showPrev = true;
      // console.log(this.prev);
    }, error =>{
      console.log(error);
    });
  }

  // Update Item
  updateItem() {
    const headers = new HttpHeaders()
      .set('apikey', 'PgoSTaCF')
      .set('Content-Type', 'application/json');

    let formData = new HttpParams();
    for (let index = 0; index < this.parametri$.length; index++) {
      let temp = this.parametri$[index].toString();
      var inputValue = (<HTMLInputElement>document.getElementById(this.parametri$[index])).value;

      formData = formData.append('fields[' + this.parametri$[index] + ']', inputValue);
    }

    // Richiesta - Errore 403*
    this.httpClient.post(environment.URL_ROOT + '/item/concrete/update/' + this.item_id, {headers, params: formData})
    .subscribe((data:any) =>{
      this.getDetails();
    }, error =>{
      console.log(error);
    });

  }
    
  // Pulsante Annulla
  goBack(){
    this.router.navigateByUrl('/articoli');
  }

}

