import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from './../../../environments/environment';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

var del_item_id: String;


@Component({
  selector: 'app-smartmatch',
  templateUrl: './smartmatch.component.html',
  styleUrls: ['./smartmatch.component.scss']
})
export class SmartmatchComponent implements OnInit, OnDestroy {
  // var Item
  varItem;
  // Var Templates via ItemType.ID
  templates;
  
  // DT 
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  matchs$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  // Alert e Modal
  private _success = new Subject<string>();
  private _successAdd = new Subject<string>();
  staticAlertClosed = false;
  alias: String;
  providers: [NgbModalConfig, NgbModal]
  successMessage = '';
  successMessageAdd = '';

  // Preview
  prev;
  showPrev: boolean = false;



  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig, private router: Router) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

    ngOnInit() {
      // Controllo l'accesso
      if (localStorage.getItem('apikey') != null || localStorage.getItem('apikey') != '') {
        // this.getItemTemplate;
        let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(environment.URL_ROOT + '/item/type', { headers })
        .toPromise().then((data:any) => {
          this.varItem = data;
        });
        // DataTables
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true
        };
        this.getMatches();        
      } else {
        this.router.navigate(['../login']);
      }
    }

    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    // Add SmartMartch - Tipo Articolo e Template
    getItemTemplate () {
      
    }

    // Matches
    getMatches() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/matching?recordsPerPage=999999999999', { headers })
      .toPromise().then((data:any) => {
        this.matchs$ = data.matching;
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

    // Articoli
    getItems() {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      this.httpClient.get(environment.URL_ROOT + '/item/type', { headers })
      .toPromise().then((data:any) => {
        this.varItem = data;
      });
    }




  // --------------------------------------------------------------------------------------------------------------------------------------------
    // Funzione Elimina Match - OpenModal
    open(content, d_item_id: String, d_item_a: String) {
      // Passo le info dell'item da eliminare
      del_item_id = d_item_id;
      this.alias = d_item_a;
      // Mostro il Modal per la conferma
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    }

    // API DELETE SM
    deleteItem(): void {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
      this.httpClient.delete(environment.URL_ROOT + '/matching/' + del_item_id, { headers }).subscribe(data => {
        this.modalService.dismissAll();
        this.showAlert();
        this.getMatches();
      });
    }

    

  // Rerender Tabella
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }


  // Aggiungi SmartMatch ----------------------------------------------------------------------------
  // addSm(items, template_name, label_id, decorators, is_active, bypass_promo) {
    addSm(items: string, template_name, label_id: string, is_active, bypass_promo) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // Parametri
    let params = new HttpParams()
    .set('items[]', items)
    .set('template_name', template_name)
    .set('label_id', label_id)
    //.set('decorators[]', decorators)
    .set('is_active', is_active)
    .set('bypass_promo', bypass_promo);

    console.log('itemID: ' + items);
    console.log('Template Name: ' + template_name);
    console.log('Label ID: ' + is_active);
    
    // Aggiungo SmartMatch
    this.httpClient.post(environment.URL_ROOT + '/matching', params, { headers }).subscribe(data =>{
      this.getMatches();
      this.showAlertAdd();
    });
  }


  // Preview -------------------------
  openPreview(id) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Richiesta preview
    this.httpClient.get(environment.URL_ROOT + '/matching/preview/' + id, { headers }).subscribe(data =>{
      this.prev = data;
      this.showPrev = true;
    });
  }



  // Alerts ----------------------------------------

  // Alert di Conferma DELETE
  public showAlert() {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
    this._success.next('Match ' + this.alias + ' rimosso con successo!');
  }

  // Alert Conferma POST
  public showAlertAdd() {
    this._successAdd.subscribe(message => this.successMessageAdd = message);
    this._successAdd.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessageAdd = '');
  
    this._successAdd.next('SmartMatch creato correttamente!');
  }



}
