import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Global } from '../../variables/global';

@Component({
  selector: 'app-viewlabel',
  templateUrl: './viewlabel.component.html',
  styleUrls: ['./viewlabel.component.css']
})
export class ViewlabelComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) { }
  // Var
  label_id;

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('item_id') != null || localStorage.getItem('item_id') != '') {
      this.label_id = localStorage.getItem('label_id');
      this.getDetails();         
    } else {
      // this.router.navigate(['../etichette']);
    }
  }


  // API GET 
  getDetails() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(Global.URL_ROOT + '/labelinfo/labelid/' + this.label_id, { headers })
    .toPromise().then((data:any) => {
      console.log('Richiesta effettuata correttamente');
      // this.parametri$ = Object.keys(data.current_fields);
      // this.valori$ = data.current_fields;
    });
  }

  // Annulla
  goBack(){
    this.router.navigateByUrl('/articoli');
  }

}
