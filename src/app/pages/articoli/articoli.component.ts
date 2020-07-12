import {
	Component,
	OnInit,
	OnDestroy,
	ViewChild,
	ViewChildren,
	QueryList,
	ElementRef,
  } from '@angular/core';
  import {
	HttpClient,
	HttpHeaders
  } from '@angular/common/http';
  import {
	Subject
  } from 'rxjs';
  import {
	NgbModal,
	NgbModalConfig
  } from '@ng-bootstrap/ng-bootstrap';
  import {
	DataTableDirective
  } from 'angular-datatables';
  import {
	debounceTime
  } from 'rxjs/operators';
  import {
	Router
  } from '@angular/router';
  import {
	environment
  } from './../../../environments/environment';
  
  var del_item_id: String;
  
  // Componente principale
  @Component({
	selector: 'app-articoli',
	templateUrl: './articoli.component.html',
	styleUrls: ['./articoli.component.scss']
  })
  
  export class ArticoliComponent implements OnInit, OnDestroy {
  
	// Var DataTables
	@ViewChild(DataTableDirective, {
	  static: false
	})
	dtElement: DataTableDirective;
	items$: any[] = [];
	dtOptions: any = {};
	dtTrigger: Subject < any > = new Subject();
  
	// Variabili ItemType
	items_t;
	titems_t: number;
  
	// Alert e Modal - Delete
	private _success = new Subject < string > ();
	staticAlertClosed = false;
	alias: String;
	providers: [NgbModalConfig, NgbModal]
	successMessage = '';
  
	// Multiple Delete
	index = 0;
	indexDel = 0;
	delItems$: any[] = [];
	toZero: boolean = true;
	 // altro
	 nomeBtn: string = 'Seleziona Tutti';
	 totalCheck: number = 0;
  
  
	constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig, private router: Router) {
	  config.backdrop = 'static';
	  config.keyboard = false;
	}
  
	// Init
	ngOnInit(): void {
	  // Controllo l'accesso
	  if (localStorage.getItem('apikey') != null) {
		// DataTables Options
		this.dtOptions = {
		  pagingType: 'full_numbers',
		  pageLength: 10,
		  processing: true,
		  order: [],
		  select: {
			style: 'multi'
		  },
		  retrieve: true,
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
  
	// Destory
	ngOnDestroy(): void {
	  this.dtTrigger.unsubscribe();
	}
  
	// API Articoli
	getItems() {
	  let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
	  this.httpClient.get(environment.URL_ROOT + '/item/concrete?recordsPerPage=999999999999', {
		  headers
		})
		.toPromise().then((data: any) => {
		  this.items$ = data.items;
		  this.dtTrigger.next();
		}, error => {
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
	  let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
	  this.httpClient.get(environment.URL_ROOT + '/item/type', {
		  headers
		})
		.toPromise().then((itemtAPI: any) => {
		  this.titems_t = itemtAPI.total_itemtype;
		  this.items_t = itemtAPI.itemtype;
		}, error => {
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
	  this.modalService.open(content, {
		ariaLabelledBy: 'modal-basic-title'
	  })
	}
  
	openMultiple(multiple) {
	  // Mostro il Modal per la conferma
	  this.modalService.open(multiple, {
		ariaLabelledBy: 'modal-basic-title'
	  })
	}
  
	// API DELETE Item
	deleteItem(): void {
	  let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
	  headers.set('Content-Type', 'application/x-www-form-urlencoded');
	  this.httpClient.delete(environment.URL_ROOT + '/item/concrete/' + del_item_id, {
		headers
	  }).subscribe(data => {
		this.getItems();
		this.modalService.dismissAll();
		this.showAlert();
	  }, error => {
		console.log(error);
	  });
	}
  
	// Multiple DELETE ------
	@ViewChildren("checkboxes") checkboxes: QueryList < ElementRef > ;
	deleteMultiple() {
	  this.toZero = true;
	  this.checkboxes.forEach((element) => {
		if (element.nativeElement.checked == true) {
		  this.delItems$[this.indexDel] = element.nativeElement.id;
		  this.indexDel++;
		}
	  });
  
	  let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
	  headers.set('Content-Type', 'application/x-www-form-urlencoded');
	  let i;
  
	  this.delItems$.forEach(element => {
		this.httpClient.delete(environment.URL_ROOT + '/item/concrete/' + element, {
		  headers
		}).subscribe(data => {
		  // Index elemento da eliminare
		  let i: number;
		  i = this.delItems$.indexOf(element);
  
		  // Parte Grafica
		  this.getItems();
		  this.modalService.dismissAll();
		  this.showAlertMultiple();
		  // Rimuovere item dall'array
		  this.delItems$.splice(i, 1);
		  this.index--;
		}, error => {
		  console.log(error);
		});
  
	  });
	}
   
		// Aggiungi tutti gli ITEM alla lista
	checkAll() {
		this.getIndex();
		if (this.index == this.totalCheck) {
			this.checkboxes.forEach((element) => {
				element.nativeElement.checked = false;
				this.getIndex();

			});
			this.nomeBtn = 'Seleziona Tutti';

		} else {
			this.checkboxes.forEach((element) => {
				element.nativeElement.checked = true;
				this.getIndex();

			});
			this.nomeBtn = 'Deseleziona Tutti';
		}
	}
  
	// Singolo Chechbox control
	ngOnSelected() {
	  this.getIndex();

	  if (this.index == this.totalCheck) {
		
		this.nomeBtn = 'Deseleziona Tutti';

	} else {
		
		this.nomeBtn = 'Seleziona Tutti';
	}
	}
  
	// Conteggio Articoli Selezionati
	getIndex() {
	  this.index = 0;
	  this.totalCheck = 0;
	  this.checkboxes.forEach((element) => {
		  this.totalCheck++;
		if (element.nativeElement.checked == true) {
		  this.index++;
		}
	  });
	}
  
	// DELETE - Alert e Modal
	// Alert di Conferma
	public showAlert() {
	  this._success.subscribe(message => this.successMessage = message);
	  this._success.pipe(
		debounceTime(5000)
	  ).subscribe(() => this.successMessage = '');
	  this._success.next('Articolo ' + this.alias + ' rimosso con successo!');
	}
	// Alert di Conferma Multiplo
	public showAlertMultiple() {
		this._success.subscribe(message => this.successMessage = message);
		this._success.pipe(
		  debounceTime(5000)
		).subscribe(() => this.successMessage = '');
		this._success.next('Articoli rimossi con successo!');
	  }
  
	// Rerender Tabella
	rerender(): void {
	  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
		dtInstance.destroy();
		// this.getItems();
		// this.dtTrigger.next();
	  });
	}
  
  }