import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  environment
} from './../../../environments/environment';

@Component({
  selector: 'app-viewlabel',
  templateUrl: './viewlabel.component.html',
  styleUrls: ['./viewlabel.component.css']
})
export class ViewlabelComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) {}
  // Var
  label_id;
  // Var API GET
  info$: any[] = [];
  matchs$ = [];

  // Preview
  prevA;
  prev: string = '';
  showPrev: boolean = false;

  // Variabili Tabella Dettagli
  labelId;
  powerStatus;
  connStatus;
  updateAt;
  typeLabel;
  apId;

  ngOnInit(): void {
    // Controllo l'accesso
    if (localStorage.getItem('item_id') != null || localStorage.getItem('item_id') != '') {
      this.label_id = localStorage.getItem('label_id');
      this.getDetails();
      this.getMatch();
    } else {
      this.router.navigate(['../etichette']);
    }
  }


  // API GET label_info
  getDetails() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/labelinfo/labelid/' + this.label_id, {
        headers
      })
      .toPromise().then((data: any) => {
        let temp_data = data.label_info;
        this.info$ = temp_data[0];
        this.labelId = temp_data[0].LabelId;
        this.powerStatus = temp_data[0].PowerStatus;
        this.connStatus = temp_data[0].ConnectionStatus;
        this.updateAt = temp_data[0].UpdatedAt;
        this.typeLabel = temp_data[0].Type;
        this.apId = temp_data[0].AccessPointId;
      }, error => {
        console.log(error);
      });
  }

  // API GET  matching
  getMatch() {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    this.httpClient.get(environment.URL_ROOT + '/matching/label/' + this.label_id, {
        headers
      })
      .toPromise().then((data: any) => {
        let temp_data = data.matching;
        this.matchs$ = temp_data;
        // console.log(this.matchs$)
      }, error => {
        console.log(error);
      });
  }

  // Annulla
  goBack() {
    this.router.navigateByUrl('/etichette');
  }


  // Preview 
  openPreview(id) {
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
      console.log(this.prev);
    }, error => {
      console.log(error);
    });
  }

  // API Attiva Match
  activateLabel(id) {
    let headers = new HttpHeaders().set('apikey', localStorage.getItem('apikey'));
    // headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.httpClient.options(environment.URL_ROOT + '/matching/' + id, {
      headers,
      responseType: 'text'
    }).subscribe(data => {
      console.log(data);
      this.httpClient.put(environment.URL_ROOT + '/matching/' + id, {
        headers
      }).subscribe();
    }, error => {
      console.log(error);
    });
  }

}