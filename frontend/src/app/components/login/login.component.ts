import { Component } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string
  password: string
  userfound: boolean;
  constructor(
    public auth: AuthService,
  ) { }

  public verifyUser(email, password){

    this.userfound = this.auth.login(email, password);
    console.log(this.userfound);
  }



}
