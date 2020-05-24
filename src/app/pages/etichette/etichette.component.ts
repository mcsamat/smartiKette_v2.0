import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { environment } from './../../../environments/environment';
import { debounceTime } from 'rxjs/operators';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


var del_label_id: String;


// Componente principale
@Component({
  selector: 'app-etichette',
  templateUrl: './etichette.component.html',
  styleUrls: ['./etichette.component.scss']
})

export class EtichetteComponent implements OnInit, OnDestroy {
  // Label VAR
  batteria: number;
  // DT var
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  labels$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  elNumber: string;

  // Alert e Modal
  private _success = new Subject<string>();
  private _successAdd = new Subject<string>();
  staticAlertClosed = false;
  label_name: String;
  providers: [NgbModalConfig, NgbModal]
  successMessage = '';
  successMessageAdd = '';

  // Aggiungi Label
  valid_label_id: boolean = false;

  // Preview
  prevA;
  prev: string = '';
  showPrev: boolean = false;
  

  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig, private router: Router) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('apikey') != null || localStorage.getItem('apikey') != '') {
      // GET Label
      this.getLabel(); 
      // DataTables Options
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        dom: this.elNumber
      };
             
    } else {
      this.router.navigate(['../login']);
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  

  // API GET Label
  getLabel() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/labelinfo?recordsPerPage=999999999999', { headers })
    .toPromise().then((data:any) => {
      this.labels$ = data.label_info;
      console.log(this.labels$);
      this.dtTrigger.next();
    });

    // Paginazione
    if (this.labels$.length <= 10) {
     this.elNumber = 'lfti';
    } else {
      this.elNumber = 'plfti';
    }
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


  // --------------------------------------------------------
  // Aggiungi Etichette

  // Modal Etichetta Manuale
  openManual(addManual) {
    this.modalService.open(addManual, {ariaLabelledBy: 'modal-basic-title'})
  }

  postManual(ids: string){
    if (ids == null || ids == '') {
      this.valid_label_id = true;
    } else {
      let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
      let params = new HttpParams()
      .set('label_id[]', ids)
      this.httpClient.post(environment.URL_ROOT + '/label', params ,{ headers }).subscribe(data => {
        this.modalService.dismissAll();
        this.showAlertAdd();
      }, error =>{
        console.log(error);
      });
    }
  }

  // Modal Etichetta File
  openFile(addFile) {
    // Mostro il Modal per la conferma
    this.modalService.open(addFile, {ariaLabelledBy: 'modal-basic-title'})
  }
  postFile(file: File){
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    console.log(file);
    //let params = new HttpParams()
    //.set('label_id[]', file)
    //this.httpClient.post(environment.URL_ROOT + '/label/file', params ,{ headers }).subscribe();

  }






  // Preview -------------------------
  openPreview(id) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Richiesta preview
    this.httpClient.get(environment.URL_ROOT + '/matching/preview/active/' + id, { headers }).subscribe(data =>{
      this.prevA = data;
      this.prev = this.prevA.preview;
      this.showPrev = true;
    }, error =>{
      console.log(error);
    });
  }




  // Alert Conferma ---------------------------------------------------
  public showAlertAdd() {
  this._successAdd.subscribe(message => this.successMessageAdd = message);
  this._successAdd.pipe(
    debounceTime(5000)
  ).subscribe(() => this.successMessageAdd = '');

  this._successAdd.next('Tutte le etichette sono state registrate correttamente. Tra qualche minuto saranno ONLINE.');
}



// View Details Label
viewLabel(labelId) {
  localStorage.removeItem('label_id');
  localStorage.setItem('label_id', labelId);
  this.router.navigateByUrl('/view-label');
}


// API GET /api/matching/active/LGN20012 - trova l'id del match da scollegare
getIdActive(id) {
  let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
  
  this.httpClient.get(environment.URL_ROOT + '/matching/active/' + id, { headers }).subscribe(data =>{
    this.prevA = data;
    this.prev = this.prevA.preview;
    this.showPrev = true;
  }, error =>{
    console.log(error);
  });

}

// API Scollega Label PUT /api/matching/{matchingId}/deactivate
putDeactivateMatch(id) {
  let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
  let matchId: string;
  // Trovo ID del match
  this.httpClient.get(environment.URL_ROOT + '/matching/active/' + id, { headers }).subscribe(data =>{
    let temp = data;
    // matchId = temp.id;
    console.log('ID: ' + matchId);
    console.log(localStorage.getItem('apikey'));


    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Elimino il match
    let tempId = matchId;
    this.httpClient.put(environment.URL_ROOT + '/matching/' + tempId + '/deactivate', { headers }).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    }
    );
  }, error =>{
    console.log(error);
  });
}





}

