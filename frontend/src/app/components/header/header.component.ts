import { Component } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { externalLink } from 'src/app/helpers/constants'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  link = externalLink

  constructor(public auth: AuthService) { }

}
