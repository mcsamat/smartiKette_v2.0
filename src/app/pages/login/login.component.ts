import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Credentials } from 'src/app/variables/credentials';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Root URL per API
  readonly ROOT_URL = 'http://pietro-test.dlinkddns.com:10082/api';
  // Credenziali d'accesso
  userModel = new Credentials(localStorage.getItem('username'), localStorage.getItem('password'), false);
  // var per passare apikey
  key: string;
 
  // Costruttore
  constructor(private httpClient: HttpClient, private router: Router) { }

  // Pulsante Accedi
  onSubmit() {
    // Header
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    // Richiesta ApiKey
    this.httpClient.post(this.ROOT_URL + '/apikey', 'username=' + this.userModel.username + '&password=' + this.userModel.password, { headers })
    .toPromise().then((data:any) => {
      // Assegno il valore di apikey alla variabile key - e al localStorage
      this.key = data.apikey;
      localStorage.setItem('apikey', this.key);

      // Redirect alla Dashboard
      if (this.key == null) {
        console.log('Credenziali errate');
      } else {
        this.router.navigate(['../dashboard']);
      }
    });

    // Funzione ricordami
    if (this.userModel.remember){
      localStorage.setItem('username', this.userModel.username);
      localStorage.setItem('password', this.userModel.password);
    } else {
      localStorage.setItem('username', this.userModel.username);
      localStorage.setItem('password', '');
  };
}

  ngOnInit() {

  }
  ngOnDestroy() {
  }

}