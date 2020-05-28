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
  label$: any[] = [];

  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('new_item_id') != null || localStorage.getItem('new_item_id') != '') {
      this.item_id = localStorage.getItem('new_item_id');
      this.getDetails();         
    } else {
      this.router.navigate(['../articoli']);
    }
  }

  // Richiesta API campi articolo
  getDetails() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/item/type/' + this.item_id, { headers })
    .toPromise().then((data:any) => {
      this.label$ = data.fields;
    }, error =>{
      console.log(error);
    });
  }

  // Crea nuovo articolo
  addItem() {
    const headers = new HttpHeaders()
      .set('apikey', 'PgoSTaCF')
      // .set('Content-Type', 'application/json');

    let formData = new HttpParams();
    formData = formData.append('item_type_id', this.item_id);

    for (let index = 0; index < this.label$.length; index++) {
      var inputValue = (<HTMLInputElement>document.getElementById(this.label$[index].name)).value;
      formData = formData.append('fields[' + this.label$[index].name + ']', inputValue);

      // console.log(this.label$[index].name);
      // console.log(inputValue);
    }
  

    // Richiesta - Errore 403*
    this.httpClient.post(environment.URL_ROOT + '/item/concrete/create', {headers, params: formData})
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
