import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';
import {
  Subject
} from 'rxjs';
import {
  debounceTime
} from 'rxjs/operators';
import {
  Router
} from '@angular/router';
import {
  environment
} from './../../../environments/environment';

var del_loc_id: String;


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  // Variabili Location
  locations$;
  // Alert e Modal
  private _success = new Subject < string > ();
  private _successAdd = new Subject < string > ();
  staticAlertClosed = false;
  alias: String;
  aliasAdd: String;
  providers: [NgbModalConfig, NgbModal]
  deleteMessage = '';
  successMessage = '';


  constructor(private httpClient: HttpClient, private modalService: NgbModal, config: NgbModalConfig, private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    // Controllo l'accesso
    if (localStorage.getItem('apikey') != null) {
      this.getLocations();
    } else {
      this.router.navigate(['../login']);
    }
  }


  // Metodo GET - Visualizzare Locations -----------------------------------------------------------------
  getLocations() {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    // Elenco Corsie
    this.httpClient.get(environment.URL_ROOT + '/location', {
        headers
      })
      .toPromise().then((data: any) => {
        this.locations$ = data.locations;
      }, error => {
        console.log(error);
      });
  }


  // Metodo POST - Aggiungere Location ------------------------------------------------------------------
  postCorsia(nomeLocation: string, tipoLocation: string) {
    // Header generale
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    console.log(localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // Parametri
    let params = new HttpParams()
      .set('locationTypeId', tipoLocation)
      .set('locationName', nomeLocation)
      .set('isActive', 'true');

    // Aggiungo Location
    this.httpClient.post(environment.URL_ROOT + '/location', params, {
      headers
    }).subscribe(data => {
      this.aliasAdd = nomeLocation;
      this.showAlertSuccess();
      this.getLocations();
    }, error => {
      console.log(error);
    });
  }

  // Alert di Conferma POST
  public showAlertSuccess() {
    this._successAdd.subscribe(message => this.successMessage = message);
    this._successAdd.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
    this._successAdd.next('Location ' + this.aliasAdd + ' aggiunta con successo!');
  }


  // Metodo DELETE - Rimovi Location ---------------------------------------------------------------------
  deleteLocation(): void {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.httpClient.delete(environment.URL_ROOT + '/location/' + del_loc_id, {
      headers
    }).subscribe(data => {
      this.modalService.dismissAll();
      this.showAlert();
      this.getLocations();
    }, error => {
      console.log(error);
    });
  }

  // Funzione OpenModal - Conferma Eliminazione
  open(content, d_item_id: String, d_item_a: String) {
    del_loc_id = d_item_id;
    this.alias = d_item_a;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    })
  }

  // Alert di Conferma DELETE
  public showAlert() {
    this._success.subscribe(message => this.deleteMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.deleteMessage = '');
    this._success.next('Location ' + this.alias + ' rimossa con successo!');
  }


}