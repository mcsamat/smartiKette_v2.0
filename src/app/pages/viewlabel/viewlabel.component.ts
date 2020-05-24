import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-viewlabel',
  templateUrl: './viewlabel.component.html',
  styleUrls: ['./viewlabel.component.css']
})
export class ViewlabelComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) { }
  // Var
  label_id;
  // Var API GET
  info$ = [];
  matchs$ = [];

   // Preview
   prevA;
   prev: string = '';
   showPrev: boolean = false;

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('item_id') != null || localStorage.getItem('item_id') != '') {
      this.label_id = localStorage.getItem('label_id');
      this.getDetails();
      this.getMatch();         
    } else {
      this.router.navigate(['../etichette']);
    }
  }


  // API GET label_info
  getDetails() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/labelinfo/labelid/' + this.label_id, { headers })
    .toPromise().then((data:any) => {
      let temp_data = data.label_info;
      this.info$ = temp_data[0];
    });
  }

  // API GET  matching
  getMatch() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/matching/label/' + this.label_id, { headers })
    .toPromise().then((data:any) => {
      let temp_data = data.matching;
      this.matchs$ = temp_data;
      // console.log(this.matchs$)
    });
  }

  // Annulla
  goBack(){
    this.router.navigateByUrl('/etichette');
  }


   // Preview ------------------------- La chiamata funziona, ma stesso errore della preview SmartMatch
   openPreview(id) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Richiesta preview
    this.httpClient.get(environment.URL_ROOT + '/matching/preview/' + id, { headers }).subscribe(data =>{
      this.prevA = data;
      this.prev = this.prevA.preview;
      this.showPrev = true;
    });
  }

}
