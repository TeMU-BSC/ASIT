import { Component } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { externalLink } from 'src/app/helpers/constants'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  link = externalLink

  constructor(public auth: AuthService) { }

}
