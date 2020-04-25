import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router, private httpClient: HttpClient) {
    this.location = location;
  }
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api';
  // Variabili System
  // sk_v: any;
  username: string;
  confname: string;



  ngOnInit() {
    // Verificare se sia o meno presente l'apikey in locale (nell'Admin layout)
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.username = localStorage.getItem('username');

    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Name API
    this.httpClient.get(this.ROOT_URL + '/system/configuration', { headers })
    .toPromise().then((infoconf:any) => {
      // Passo i valori presi da API
      this.confname = infoconf.configurations.installation_name;
    });

  }

  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  logout(){
    console.log('logout');
    localStorage.setItem('apikey', '');
    this.router.navigate(['../login']);
  }

}
