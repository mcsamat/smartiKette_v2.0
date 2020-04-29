import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';

import { debounceTime } from 'rxjs/operators';

import { Router } from '@angular/router';

var del_item_id: String;


// Componente principale
@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.scss']
})

export class ArticoliComponent implements OnInit, OnDestroy {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/item';

  // DT var
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  items$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  // Var Crea Nuovo
  // Variabili ItemType
  items_t;
  titems_t: number;

  // Alert e Modal
  private _success = new Subject<string>();
  staticAlertClosed = false;
  alias: String;
  providers: [NgbModalConfig, NgbModal]
  successMessage = '';

  // Test
  item_r_id;


  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig, private router: Router) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    // DataTables Options
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [],
      // dom: 'lfti',
    };
    // GET Label
    this.getItems();

    this.getItemType();

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // API GET Item
  getItems() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Richiesta
    this.httpClient.get(this.ROOT_URL + '/concrete?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.items$ = data.items;
      // console.log(this.items$);
      this.dtTrigger.next();
    });
  }

  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Funzione viewItem - routing per la pagina dei dettagli
  viewItem(item_id: string) {
    localStorage.removeItem('item_id');
    localStorage.setItem('item_id', item_id);
    this.router.navigateByUrl('/view-item');
  }





  // --------------------------------------------------------------------------------------------------------------------
  // Funzione Crea Nuovo Articolo
  getItemType() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    // Item Type API
    this.httpClient.get(this.ROOT_URL + '/type', { headers })
    .toPromise().then((itemtAPI:any) => {
      // console.log(itemtAPI);
      this.titems_t = itemtAPI.total_itemtype;
      this.items_t = itemtAPI.itemtype;
    });
  }

  addItem() {
    // WiP
  }





  // ----------------------------------------------------------------------------------------------------------------------------
  // Funzione OpenModal
  open(content, d_item_id: String, d_item_a: String) {
    // Passo le info dell'item da eliminare
    del_item_id = d_item_id;
    this.alias = d_item_a;
    // Mostro il Modal per la conferma
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  // API DELETE Item
  deleteItem(): void {
    // Header apikey + Content-Type
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // API - DELETE
    this.httpClient.delete(this.ROOT_URL + '/concrete/' + del_item_id, { headers }).subscribe();

    // Chiuso il modal mostro l'alert, e renderizzo nuovamente la tabella
    this.modalService.dismissAll();
    this.showAlert();
    this.rerender();
      
  }

  // Render Tabella
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Distruggo la vecchia tabella
      dtInstance.destroy();
      // Nuova chiamata agli API (il delay di 100ms serve per ottenere API aggiornati)
      setTimeout(() => {
        this.getItems();
      }, 100);
    });
  }


 // Alert 
 public showAlert() {
  this._success.subscribe(message => this.successMessage = message);
  this._success.pipe(
    debounceTime(5000)
  ).subscribe(() => this.successMessage = '');

  this._success.next('Articolo ' + this.alias + ' rimosso con successo!');
}

}
