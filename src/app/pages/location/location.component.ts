import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Global } from '../../variables/global';

var del_loc_id: String;


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/location';
  // Variabili Location
  locations$;
  // Alert e Modal
  private _success = new Subject<string>();
  staticAlertClosed = false;
  alias: String;
  providers: [NgbModalConfig, NgbModal]
  successMessage = '';


  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.getLocations();
  }

  // Metodo GET - Visualizzare Locations
  getLocations() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Elenco Corsie
    this.httpClient.get(this.ROOT_URL, { headers })
    .toPromise().then((data:any) => {
      // Passo i valori presi da API
      this.locations$ = data.locations;
      // console.log(this.corsie$[0].location_type.id)
    });
  }

  // Metodo POST - Aggiungere Location
  postCorsia(nomeLocation: string, tipoLocation: string) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    console.log(localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Params
    let params = new HttpParams()
    .set('locationTypeId', tipoLocation)
    .set('locationName', nomeLocation)
    .set('isActive', 'true');
    
    // Aggiungo Location
    this.httpClient.post(this.ROOT_URL, params, { headers }).subscribe();

    // Aspetto 100ms e richiedo i nuovi dati
    setTimeout(()=>{
      this.getLocations();
    }, 100);
  }




  // Funzione Elimina Location - OpenModal
  open(content, d_item_id: String, d_item_a: String) {
    // Passo le info dell'item da eliminare
    del_loc_id = d_item_id;
    this.alias = d_item_a;
    // Mostro il Modal per la conferma
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  // API DELETE Item
  deleteLocation(): void {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.httpClient.delete(Global.URL_ROOT + '/location/' + del_loc_id, { headers }).subscribe();
    // Chiuso il modal mostro l'alert, e renderizzo nuovamente la tabella
    this.modalService.dismissAll();
    this.showAlert();
    setTimeout(() => {
      this.getLocations();
    }, 1000);
  }


  // Alert di Conferma ------- Da Aggiungere
  public showAlert() {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
    this._success.next('Articolo ' + this.alias + ' rimosso con successo!');
  }



}
