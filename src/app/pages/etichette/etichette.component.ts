import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';

import { debounceTime } from 'rxjs/operators';

var del_label_id: String;


// Componente principale
@Component({
  selector: 'app-etichette',
  templateUrl: './etichette.component.html',
  styleUrls: ['./etichette.component.scss']
})

export class EtichetteComponent implements OnInit, OnDestroy {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api';

  // DT var
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  labels$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  // Alert e Modal
  private _success = new Subject<string>();
  staticAlertClosed = false;
  label_name: String;
  providers: [NgbModalConfig, NgbModal]
  successMessage = '';
  

  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    // DataTables Options
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
      // dom: 'lfti',
    };
    // GET Label
    this.getLabel();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // API GET Label
  getLabel() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // Richiesta GET
    this.httpClient.get(this.ROOT_URL + '/labelinfo?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.labels$ = data.label_info;
      this.dtTrigger.next();
    });
  }

  // ----------------------------------------------------------------------------------------------------------------------------
  // Funzione OpenModal
  open(content, d_label_id: String) {
    // Passo le info dell'item da eliminare
    del_label_id = d_label_id;
    this.label_name = d_label_id;
    // Mostro il Modal per la conferma
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  // API DELETE Label - Work In Proges ................................
  deleteLabel(): void {
    // Header apikey + Content-Type
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // API - DELETE
    // this.httpClient.delete(this.ROOT_URL + '/label/' + del_label_id, { headers }).subscribe();

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
        this.getLabel();
      }, 100);
    });
  }


 // Alert 
 public showAlert() {
  this._success.subscribe(message => this.successMessage = message);
  this._success.pipe(
    debounceTime(5000)
  ).subscribe(() => this.successMessage = '');

  this._success.next('Etichetta ' + this.label_name + ' rimossa con successo!');
}

}
