import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';

var del_item_id: String;


// Componente principale
@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.scss']
})

export class ArticoliComponent implements OnInit, OnDestroy {

  // Var DataTables
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  items$: any[] = [];
  dtOptions: any = {};
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


  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig, private router: Router) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('apikey') != null || localStorage.getItem('apikey') != '') {
      // DataTables Options
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        order: [],
        select: {
          style: 'multi'
        }
        // dom: 'lfti',
      };
      // Tabella Articoli
      this.getItems();
      // Crea Nuovo Articolo
      this.getItemType();        
    } else {
      this.router.navigate(['../login']);
    }
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // API Articoli
  getItems() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/item/concrete?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.items$ = data.items;
      this.dtTrigger.next();
    }, error =>{
      console.log(error);
    });
  }


  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Funzione viewItem
  viewItem(item_id: string) {
    localStorage.removeItem('item_id');
    localStorage.setItem('item_id', item_id);
    this.router.navigateByUrl('/view-item');
  }

  // New Item
  addItem(id) {
    localStorage.removeItem('new_item_id');
    localStorage.setItem('new_item_id', id);
    this.router.navigateByUrl('/crea-item');
  }


  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Funzione Crea Nuovo Articolo
  getItemType() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    // Item Type API
    this.httpClient.get(environment.URL_ROOT + '/item/type', { headers })
    .toPromise().then((itemtAPI:any) => {
      // console.log(itemtAPI);
      this.titems_t = itemtAPI.total_itemtype;
      this.items_t = itemtAPI.itemtype;
      console.log(this.items_t);
    }, error =>{
      console.log(error);
    });
  }

  


    // --------------------------------------------------------------------------------------------------------------------------------------------
    // Funzione Elimina Articolo - OpenModal
    open(content, d_item_id: String, d_item_a: String) {
      // Passo le info dell'item da eliminare
      del_item_id = d_item_id;
      this.alias = d_item_a;
      // Mostro il Modal per la conferma
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    }

    // API DELETE Item
    deleteItem(): void {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
      this.httpClient.delete(environment.URL_ROOT + '/item/concrete/' + del_item_id, { headers }).subscribe(error =>{
        console.log(error);
      }, error =>{
        console.log(error);
      });
      // Chiuso il modal mostro l'alert, e renderizzo nuovamente la tabella
      this.modalService.dismissAll();
      this.showAlert();
      this.rerender();
    }

    // Multiple DELETE
    deleteMultiple() {

    }





    // Alert di Conferma
    public showAlert() {
      this._success.subscribe(message => this.successMessage = message);
      this._success.pipe(
        debounceTime(5000)
      ).subscribe(() => this.successMessage = '');
      this._success.next('Articolo ' + this.alias + ' rimosso con successo!');
    }

  // Rerender Tabella
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      // Nuova chiamata agli API (il delay di 100ms serve per ottenere API aggiornati)
      setTimeout(() => {
        this.getItems();
      }, 100);
    });
  }

}
