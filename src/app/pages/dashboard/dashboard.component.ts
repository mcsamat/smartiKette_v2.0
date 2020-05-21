import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { System } from '../../variables/system';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Var Installazione
  varInstallation;
  // Var Display&Etichette
  varLabelStat;
  varTotMatch;
  // Var APs
  varAps;
  // Var Articoli
  varItem;
  varTotItem;
  // Var Importazioni
  varImport;
  // Var Mobile Device
  varMobile;

  // Variabili System
  system_info = new System('', '', '', '', '',  '',  '',  '',  '',  '',  '');
  // Var Templates via ItemType.ID
  templates;

  
  constructor(private httpClient: HttpClient, private router: Router) { }

    ngOnInit() {
      // Controllo l'accesso
      if (localStorage.getItem('apikey') != null || localStorage.getItem('apikey') != '') {
        // Richiamo le funzioni per API
        this.getInstallation();

        this.getDisplay();
        this.getTotalMatch();
        this.getAps();

        this.getItems();
        this.getTotItem();
        this.getImport();

        this.getMobile();

        this.getInfo();         
      } else {
        this.router.navigate(['../login']);
      }
    }

    // -------- API Requests -------------------------------------------------------------------------------------------------------------------------------------
    // Informazioni Installazione
    getInstallation() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/system/configuration', { headers })
      .toPromise().then((data:any) => {
        this.varInstallation = data.configurations;
        // console.log(this.varInstallation.installation_name);
      });
    }
    // Templates
    getItemTypeTemplate(tid: number){
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/template/itemtype/' + tid, { headers })
      .toPromise().then((data:any) => {
        this.templates = data.templates;
      });
    }
    // +++++++++++++++++++++
    // Display & Etichette
    getDisplay() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/labelinfo/statistics', { headers })
      .toPromise().then((data:any) => {
        this.varLabelStat = data;
      });
    }
    // Total Matches
    getTotalMatch() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/matching', { headers })
      .toPromise().then((data:any) => {
        this.varTotMatch = data.total_matching;
      });
    }
    // Access Point
    getAps() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/accesspoint', { headers })
      .toPromise().then((data:any) => {
        this.varAps = data;
      });
    }
    // +++++++++++++++++++++
    // Articoli
    getItems() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/item/type', { headers })
      .toPromise().then((data:any) => {
        this.varItem = data;
      });
    }
    // Totale Articoli
    getTotItem() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/item/concrete', { headers })
      .toPromise().then((data:any) => {
        this.varTotItem = data;
      });
    }
    // Importazioni
    getImport(){
      this.httpClient.get(environment.URL_ROOT + '/import/queue')
      .toPromise().then((data:any) => {
        this.varImport = data;
      });
    }

    // +++++++++++++++++++++
    // Mobile Device
    getMobile() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/mobiledevice', { headers })
      .toPromise().then((mobileAPI:any) => {
        this.varMobile = mobileAPI;
      });
    }

    // +++++++++++++++++++++
    // Info Sistema
    getInfo() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/system', { headers })
      .toPromise().then((data:any) => {
        this.system_info = data;
      });
    }
  
}
