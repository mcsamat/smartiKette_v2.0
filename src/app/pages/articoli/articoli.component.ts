import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ResourceLoader } from '@angular/compiler';

import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';

import { debounceTime } from 'rxjs/operators';

var ditemm: String;
var ditemal: String;


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

  // Alert e Modal
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';
  alias: String;
  providers: [NgbModalConfig, NgbModal]
  


  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    // DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [],
      // retrieve: true,
      // dom: 'lfti',
    };
    this.getLabel();
    // Alert timeout
    setTimeout(() => this.staticAlertClosed = true, 20000);
  }

  

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  // API GET Item
  getLabel() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Richiesta
    this.httpClient.get(this.ROOT_URL + '/concrete?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.items$ = data.items;
      this.dtTrigger.next();
    });
  }









  // Funzione Modal +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  open(content, ditem: String, ditema: String) {
    // Var ID
    ditemm = ditem;
    //Alias
    ditemal = ditema;
    this.alias = ditemal;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    //.result.then((result) => {
    //  console.log('Azione 1 - Esci');
    //}, (reason) => {
    //  console.log('Azione 2 - Elimina');
    //  this.deleteItem();
      
    //  this.modalService.dismissAll();
    //});
  }

  
  
  // DELETE item
  deleteItem(): void {
    // Header apikey + Content-Type
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // API - DELETE
     this.httpClient.delete(this.ROOT_URL + '/concrete/' + ditemm, { headers }).subscribe(res =>
      this.showAlert()
      );

      this.modalService.dismissAll();
      this.rerender();
      
  }

 
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.getLabel();
      }, 100);
       
      // this.dtTrigger.next();
    });
  }










 // Alert
 public showAlert() {
  setTimeout(() => this.staticAlertClosed = true, 20000);

  this._success.subscribe(message => this.successMessage = message);
  this._success.pipe(
    debounceTime(5000)
  ).subscribe(() => this.successMessage = '');

  this._success.next('Articolo rimosso con successo! - Sparirò in 5 secondi');
}

}
