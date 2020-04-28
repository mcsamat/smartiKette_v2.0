import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ResourceLoader } from '@angular/compiler';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

var ditemm;
var ditemal: String;

// Modal Conferma DELETE Item - Template
@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Elimina Articolo</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Sicuro di voler elimare l'articolo <strong>{{ alias }}</strong>?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="deleteItem()">Sì, elimina</button>
      <button type="button" class="btn btn-outline-primary" (click)="activeModal.close('Close click')">Annulla</button>
    </div>
  `
})
// Modal Conferma DELETE Item - Funzione
export class NgbdModalContent {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/item';

  // Modal - Alias
  alias = ditemal;

  // DT var
  items$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @Input() name;

  constructor(private httpClient: HttpClient, public activeModal: NgbActiveModal) {}

  deleteItem(): void {
    // Header apikey + Content-Type
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // API - DELETE
    this.httpClient.delete(this.ROOT_URL + '/concrete/' + ditemm.id, { headers }).subscribe(res =>
      // window.location.reload()
      console.log("Eliminato")
      );
  }

}


// Componente principale ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.scss']
})


export class ArticoliComponent implements OnInit, OnDestroy {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/item';

  // DT var
  items$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  // Alert
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';

  constructor(private httpClient: HttpClient, private modalService: NgbModal) { }

  ngOnInit(): void {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [],
      // dom: 'lfti',
    };
    // Richiesta GET
    this.httpClient.get(this.ROOT_URL + '/concrete?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.items$ = data.items;
      this.dtTrigger.next();
    });

    // Alert
    setTimeout(() => this.staticAlertClosed = true, 20000);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  // DELETE item
  open(ditem: String, ditema: String) {
    ditemm = ditem;
    // console.log(ditemm);
    ditemal = ditema;
    // console.log(ditemal);

    // ditemal = ditem.reserved_alias;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'Conferma Eliminazione';
  }

  // WiP - Table Update
  identify(index, item){
    if(!item) return null;
    return item.id; 
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
