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
  // Test
  parametri$: any[] = [];
  valori$: any[] = [];

  ngOnInit(): void {
    this.item_id = localStorage.getItem('item_id');
    console.log(this.item_id);
    this.getDetails();
  }

  // Richiesta
  getDetails() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(this.ROOT_URL + '/item/concrete/' + this.item_id, { headers })
    .toPromise().then((data:any) => {
      // console.log(Object.keys(data.current_fields));
      this.parametri$ = Object.keys(data.current_fields);
      // console.log(this.parametri$);
      this.valori$ = data.current_fields;
    });
  }
    
  goBack(){
    this.router.navigateByUrl('/articoli');
  }

}

