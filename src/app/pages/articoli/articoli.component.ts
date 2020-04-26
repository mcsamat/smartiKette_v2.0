import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ResourceLoader } from '@angular/compiler';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

var ditemm;

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
      <p>Sicuro di voler elimare questo articolo?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="deleteItem()">Sì, elimina</button>
      <button type="button" class="btn btn-outline-primary" (click)="activeModal.close('Close click')">Annulla</button>
    </div>
  `
})
// Modal Conferma DELETE Item - Funzione
export class NgbdModalContent {
  @Input() name;
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/item';

  constructor(private httpClient: HttpClient, public activeModal: NgbActiveModal) {}

  deleteItem(): void {
    // Header apikey + Content-Type
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // API - DELETE
    this.httpClient.delete(this.ROOT_URL + '/concrete/' + ditemm.id, { headers }).subscribe(res =>
      window.location.reload()
      );
  }
}


// Componente principale
@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.scss']
})


export class ArticoliComponent implements OnInit {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api/item';

  // DT var
  items$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private httpClient: HttpClient, private modalService: NgbModal) { }

  ngOnInit(): void {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));

    // DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    // Richiesta GET
    this.httpClient.get(this.ROOT_URL + '/concrete?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.items$ = data.items;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  // DELETE item
  open(ditem: String) {
    ditemm = ditem;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'Conferma Eliminazione';
  }

}
