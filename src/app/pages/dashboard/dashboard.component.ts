import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { System } from '../../variables/system';
import { Identifiers } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api';
  // Variabili System
  system_info = new System('', '', '', '', '',  '',  '',  '',  '',  '',  '');
  // Variabili mobile
  mobiles;
  // Variabili APs
  aps;
  taps: number;
  // Variabili ItemType
  items_t;
  titems_t: number;
  // Variabili Import
  timports: number;
  imports;
  // Variabili labelStat - diventeranno una classe
  onl:    number;
  offl:   number;
  bgood:  number;
  bbad:   number;
  // Variabili Configurazione - diventeranno una classe
  conftype:     string;
  confname:     string;
  confpath:     string;
  confinstall:  string;
  // Var total item e total match attivi
  titem: number;
  tmatch: number;

  // Var Templates via ItemType.ID
  templates;

  
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // System API
    this.httpClient.get(this.ROOT_URL + '/system', { headers })
    .toPromise().then((data:any) => {
      // Passo i valori presi da API
      this.system_info = data;
    });

   // Display API (labelinfo/statistics)
   this.httpClient.get(this.ROOT_URL + '/labelinfo/statistics', { headers })
    .toPromise().then((labelstat:any) => {
      // Passo i valori presi da API
      this.onl    = labelstat.connection.online;
      this.offl   = labelstat.connection.offline;
      this.bgood  = labelstat.battery.good;
      this.bbad   = labelstat.battery.bad;
    });

    // Config API
    this.httpClient.get(this.ROOT_URL + '/system/configuration', { headers })
    .toPromise().then((infoconf:any) => {
      // Passo i valori presi da API
      this.conftype     = infoconf.configurations.installation_type;
      this.confname     = infoconf.configurations.installation_name;
      this.confpath     = infoconf.configurations.import_base_path;
      this.confinstall  = infoconf.configurations.installed;
    });

    // Mobile Device API
    this.httpClient.get(this.ROOT_URL + '/mobiledevice', { headers })
    .toPromise().then((mobileAPI:any) => {
      // console.log(mobileAPI);
      this.mobiles = mobileAPI.mobile_device;
      // console.log(this.mobiles[0]);
    });

    // Access Point API
    this.httpClient.get(this.ROOT_URL + '/accesspoint', { headers })
    .toPromise().then((apAPI:any) => {
      this.taps = apAPI.total_access_point;
      this.aps = apAPI.access_point;
    });

    // Item Type API
    this.httpClient.get(this.ROOT_URL + '/item/type', { headers })
    .toPromise().then((itemtAPI:any) => {
      this.titems_t = itemtAPI.total_itemtype;
      this.items_t = itemtAPI.itemtype;
    });

    // Import API
    this.httpClient.get(this.ROOT_URL + '/import/queue')
    .toPromise().then((impAPI:any) => {
      this.timports = impAPI.total_importqueue;
      this.imports = impAPI.importqueue;
    });

    // Total Items API
    this.httpClient.get(this.ROOT_URL + '/item/concrete', { headers })
    .toPromise().then((tot_item:any) => {
      this.titem = tot_item.total_items;
    });

    // Total Matches API
    this.httpClient.get(this.ROOT_URL + '/matching', { headers })
    .toPromise().then((tot_match:any) => {
      this.tmatch = tot_match.total_matching;
    });
  }

  getItemTypeTemplate(tid: number){
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Elenco Template
    this.httpClient.get(this.ROOT_URL + '/template/itemtype/' + tid, { headers })
    .toPromise().then((data:any) => {
      // Passo i valori presi da API
      this.templates = data.templates;
      console.log(this.templates)
    });

  }
}
