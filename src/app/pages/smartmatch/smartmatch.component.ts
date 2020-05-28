import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
} from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import {
  Subject
} from 'rxjs';
import {
  environment
} from './../../../environments/environment';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime
} from 'rxjs/operators';
import {
  DataTableDirective
} from 'angular-datatables';
import {
  Router
} from '@angular/router';

var del_item_id: String;


@Component({
  selector: 'app-smartmatch',
  templateUrl: './smartmatch.component.html',
  styleUrls: ['./smartmatch.component.scss']
})
export class SmartmatchComponent implements OnInit, OnDestroy {
  // VAR TEST - Aggiungere un singolo item
  testItem;
  testItemName;
  itemArray: any[] = [];

  // VAR more items
  nrItems: number = 0;

  // Verifica form -- Etichette
  @Input() labelID: string;

  // var Item
  varItem;
  selectedOption;
  // selectedOption2;
  selectedOption3;
  selectedDecoration;
  // Var Templates via ItemType.ID
  templates;

  // DT 
  @ViewChild(DataTableDirective, {
    static: false
  })
  dtElement: DataTableDirective;
  matchs$: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject < any > = new Subject();

  // Alert e Modal
  private _success = new Subject < string > ();
  private _successAdd = new Subject < string > ();
  // private _failed = new Subject < string > ();
  private _failedAdd = new Subject < string > ();
  staticAlertClosed = false;
  alias: String;
  providers: [NgbModalConfig, NgbModal]
  successMessage = '';
  successMessageAdd = '';
  failedMessage = '';
  failedMessageAdd = '';

  // Preview
  prev;
  showPrev: boolean = false;

  // Colore Caselle Input
  labelValid: boolean = false;
  itemValid: boolean = false;

  // Checkbox
  checkActiveC = 1;
  checkPromoC = 1;

  // Errori
  smError = '';


  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig, private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    // Controllo l'accesso
    if (localStorage.getItem('apikey') != null) {
      // this.getItemTemplate;
      this.getItems();
      this.selectedDecoration = '0';
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
  getItemTemplate() {

  }

  // Matches
  getMatches() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/matching?recordsPerPage=999999999999', {
        headers
      })
      .toPromise().then((data: any) => {
        this.matchs$ = data.matching;
      }, error => {
        console.log(error);
      });
  }

  // Templates
  getItemTypeTemplate(tid: number) {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/template/itemtype/' + tid, {
        headers
      })
      .toPromise().then((data: any) => {
        let temp = data.templates;
        this.templates = temp;
      }, error => {
        console.log(error);
      });
  }

  // Articoli
  getItems() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/item/type', {
        headers
      })
      .toPromise().then((data: any) => {
        this.varItem = data.itemtype;
        this.selectedOption = this.varItem[0].id;
        this.getItemTypeTemplate(this.selectedOption);
      }, error => {
        console.log(error);
      });
  }


  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Funzione Elimina Match - OpenModal
  open(content, d_item_id: String, d_item_a: String) {
    // Passo le info dell'item da eliminare
    del_item_id = d_item_id;
    this.alias = d_item_a;
    // Mostro il Modal per la conferma
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    })
  }

  // API DELETE SM
  deleteItem(): void {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.httpClient.delete(environment.URL_ROOT + '/matching/' + del_item_id, {
      headers
    }).subscribe(data => {
      this.modalService.dismissAll();
      this.showAlert();
      this.getMatches();
    }, error => {
      console.log(error);
    });
  }


  // Rerender Tabella
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }


  // Aggiungi SmartMatch ----------------------------------------------------------------------------
  addSm(template_name, label_id: string, decorators) {
    // Header
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Parametri
    let params = new HttpParams()
      .set('items[0]', this.testItem) // TEMP
      .set('template_name', template_name)
      .set('label_id', label_id)
      .set('is_active', this.checkActiveC.toString())
      .set('bypass_promo', this.checkPromoC.toString());

    // Controllo se ci sono più item da aggiungere al match ---- DA CONVERTIRE IL BARCODE IN ID
    let index = 1;
    this.itemArray.forEach(element => {
      params = params
        .set('items[' + index + ']', this.itemArray[index - 1]);
      index++;
    });

    // Decorators
    if (decorators != 0) {
      params = params.set('decorators[]', decorators);
    }

    // Aggiungo SmartMatch - Chiamata API
    this.httpClient.post(environment.URL_ROOT + '/matching', params, {
      headers
    }).subscribe(data => {
      this.getMatches();
      this.showAlertAdd();
      // console.log(data);
    }, error => {
      console.log(error);
      this.smError = error.message;
      this.showAlertAddFailed();
    });
  }


  // Preview -------------------------
  openPreview(id: string) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    // Richiesta preview
    this.httpClient.get(environment.URL_ROOT + '/matching/preview/' + id, {
      headers,
      responseType: 'text'
    }).subscribe(data => {
      this.prev = data;
      this.showPrev = true;
    }, error => {
      console.log(error);
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
  // Alert Errore POST
  public showAlertAddFailed() {
    this._failedAdd.subscribe(message => this.failedMessageAdd = message);
    this._failedAdd.pipe(
      debounceTime(5000)
    ).subscribe(() => this.failedMessageAdd = '');

    this._failedAdd.next('Errore! Impossibile create lo SmartMatch. Codice: ' + this.smError);
  }


  // CHECK ETICHETTE
  ngOnChanges(id: string) {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/labelinfo?recordsPerPage=999999999999', {
        headers
      })
      .toPromise().then((data: any) => {
        for (let index = 0; index < data.label_info.length; index++) {
          let temp = data.label_info[index].LabelId;
          if (temp == id) {
            this.labelValid = true;
            break;
          } else {
            this.labelValid = false;
          }
        }
      }, error => {
        console.log(error);
      });
  }

  // Controllo se il barcode (principale) esiste
  ngOnChangesItem(id: string, template: string) {
    let itemId;
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    // Verifico che esista il barcode sia corretto e ne prendo l'ID
    this.httpClient.get(environment.URL_ROOT + '/item/search/fastmatch/' + template + '/' + id, {
        headers
      })
      .toPromise().then((data: any) => {
        itemId = data.id;
        this.testItem = itemId;
        this.itemValid = true;
        this.httpClient.get(environment.URL_ROOT + '/item/concrete/' + this.testItem, {
            headers
          })
          // Chiamata per prendere il nome dell'articolo
          .toPromise().then((data: any) => {
            this.testItemName = data.reserved_alias;
          });
      }, error => {
        this.itemValid = false;
      });
  }


  // Add More Items
  moreItem() {
    this.nrItems = this.nrItems + 1;
  }

  counter(i: number) {
    return new Array(i);
  }


  // Funzione per ottenere le informazioni degli item collegati ai barcode aggiunti
  ngOnChangesMoreItem(template: string, index) {
    let itemId;
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    let newItem = (document.getElementById("item_barcode_" + index) as HTMLInputElement).value;


    // Verifico che esista il barcode sia corretto e ne prendo l'ID
    this.httpClient.get(environment.URL_ROOT + '/item/search/fastmatch/' + template + '/' + newItem, {
        headers
      })
      .toPromise().then((data: any) => {
        itemId = data.id;
        this.itemArray[index] = itemId;
        // this.testItem = itemId;
        // this.itemValid = true;
        this.httpClient.get(environment.URL_ROOT + '/item/concrete/' + this.testItem, {
          headers
        })
        // Chiamata per prendere il nome dell'articolo
        //.toPromise().then((data: any) => {
        //  this.testItemName = data.reserved_alias;
        //});
      }, error => {
        console.log(error);
      });
  }


}