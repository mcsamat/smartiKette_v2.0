import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Credentials
} from 'src/app/variables/credentials';
import {
  Router
} from '@angular/router';
import {
  environment
} from './../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Credenziali d'accesso
  userModel = new Credentials(localStorage.getItem('username'), localStorage.getItem('password'), false);
  // Apikey
  key: string;
  // Login Fallito
  showErrorMessage = false;


  // Costruttore
  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('apikey') != null) {
      console.log('Sessione già attiva.')
    }
  }

  ngOnDestroy() {}

  // Accedi
  onSubmit() {
    // Header
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    // Richiesta ApiKey
    this.httpClient.post(environment.URL_ROOT + '/apikey', 'username=' + this.userModel.username + '&password=' + this.userModel.password, {
        headers
      })
      .toPromise().then((data: any) => {
        // Assegno il valore di apikey alla variabile key - e al localStorage
        this.key = data.apikey;
        localStorage.setItem('apikey', this.key);

        // Redirect alla Dashboard
        if (this.key == null) {
          this.showErrorMessage = true;
        } else {
          this.router.navigate(['../dashboard']);
        }
      }, error => {
        console.log(error);
      });

    // Funzione ricordami
    if (this.userModel.remember) {
      localStorage.setItem('username', this.userModel.username);
      localStorage.setItem('password', this.userModel.password);
    } else {
      localStorage.setItem('username', '');
      localStorage.setItem('password', '');
    };
  }

}